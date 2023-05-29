import React, {useState,useEffect} from "react";
import {useParams } from "react-router-dom";
import {useTranslation} from 'react-i18next';
import "../style/common.css"
import "../style/search.css"
import dataSetting from "../data/dataSetting";
import CardMovie from "../component/cardMovie";
import saveData from "../data/saveData";
import CrePagination from "../function/updatePagination";
import Pagination from "../component/pagination"
function Search () {
    const {t} = useTranslation();
    const {query} = useParams();
    const {isSearch} = useParams();
    const [preQuery,setPreQuery] = useState("");
    const [data,setData] = useState(saveData.search.data[saveData.search.pageNow]);
    const [inputPage,setInputPage] = useState(saveData.search.pageNow);
    const [totalPages,setTotalPages] = useState(saveData.search.totalPages);
    const [curPage,setCurPage] = useState(saveData.search.pageNow);
    const [arrButPage,setArrButPage] = useState([]);
    const [indexMorePage,setIndexMorePage] = useState(saveData.search.pageMoreNow);
    const [language,setLanguage] = useState(dataSetting.language.sign);
    const callAPI = (url,saveData)=>{
        const xhr = new XMLHttpRequest();
        xhr.onload = ()=>{
            if(xhr.readyState === 4 && xhr.status === 200 && xhr.responseText!=="") saveData(JSON.parse(xhr.response));
            else console.log(`Error ${xhr.status}: ${xhr.statusText}`);
        }
        xhr.open("get",url,true);
        xhr.send();
    }
    const getData = ()=>{
        let index;
        if(dataSetting.showPagination) index = curPage;
        else index = indexMorePage;
        if(preQuery!==query) index=1;
        if(saveData.search.data[index-1]!==undefined&&saveData.search.language[index]===language){
            if(preQuery!==query) setPreQuery(query);
            if(dataSetting.showPagination){setData(saveData.search.data[index-1]);}
            else{setData(concatArr(index));}
        return;}
        let url = "https://api.themoviedb.org/3/"+(isSearch==="1"?"search":"discover")+"/movie?api_key="+saveData.apiKey+(isSearch==="1"?"&query=":"")+query+"&language="+language+"&page="+index;

        callAPI(url,setDataFunc);
    }
    useEffect(()=>{
        while(saveData.search.data.length) saveData.search.data.pop();
        saveData.search.pageNow = 1;
        saveData.search.pageMoreNow = 1;
        setInputPage(1);
        setIndexMorePage(1);
        setCurPage(1);
        getData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[query]);

    const setDataFunc = (x)=>{
        let index;
        if(preQuery!==query) {
            saveData.search.totalPages = x.total_pages;
            setTotalPages(x.total_pages);
            index=1;
            setPreQuery(query);
        }
        else{
            if(dataSetting.showPagination) index = curPage;
            else index = indexMorePage;
        }
        saveData.search.language[index-1]=language;
        saveData.search.data[index-1] = x.results;
        if(dataSetting.showPagination) setData(x.results);
        else setData(concatArr(index));
    }
    const concatArr = (index)=>{
        let arr=[];
        for(let i=0;i<index;i++){
            arr=arr.concat(saveData.search.data[i]);
        }
        return arr;
    }
    const setCurPageFunc = (x)=>{
        saveData.search.pageNow=x;
        setCurPage(x);
        setInputPage(x);
    }
    const setIndexMorePageFunc = (x)=>{
        saveData.search.pageMoreNow=x;
        setIndexMorePage(x);
    }
    useEffect(()=>{setLanguage(dataSetting.language.sign)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[dataSetting.language]);
    useEffect(()=>{if(preQuery===query) getData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[indexMorePage,curPage,language]);
    useEffect(()=>{if(dataSetting.showPagination){CrePagination(setArrButPage,curPage,totalPages)}},[totalPages,curPage]);
    return (
        <div className="commonContainer">
            {isSearch==="1"&&<h2> {t("Search")}<span> {query} </span></h2>}
            {isSearch==="0"&&<div className="detailFilter">
                <h2> {t("Filter")} </h2>
                {saveData.filter.sort!==""&&<span> {t(saveData.filter.sort)+" "+t(saveData.filter.directionSort)} </span>}
                {saveData.filter.genres.length!==0&&saveData.filter.genres.map((item,index)=>{
                    return(
                        <span key={index}> {t(item)} </span>
                    )
                })}
                {saveData.filter.country!==""&&<span> {t(saveData.filter.country)} </span>}
                </div>
                }
            {data!==undefined&&(data.length?<>
                <CardMovie method={"movie"} data={data}/>
                <Pagination arrButPage={arrButPage} curPage={curPage} setCurPageFunc={setCurPageFunc} totalPages={totalPages} inputPage={inputPage} setInputPage={setInputPage} indexMorePage={indexMorePage} setIndexMorePageFunc={setIndexMorePageFunc}/>
            </>:
            <div className="emptySearch">
                <img src="https://cdn.glitch.global/f41a9bd0-8a31-41ac-a400-886f727e1815/search.png?v=1684402479948" alt="empty search"/>
                <h1> No results have been discovered! </h1>
            </div>
            )}
        </div>
    );
}
export default Search;