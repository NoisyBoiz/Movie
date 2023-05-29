import React, {useState,useEffect} from "react";
import {useTranslation} from 'react-i18next';
import "../style/common.css"
import saveData from "../data/saveData";
import dataSetting from "../data/dataSetting";
import CardMovie from "../component/cardMovie";
import CrePagination from "../function/updatePagination";
import Pagination from "../component/pagination"
function Theatres () {
    const {t} = useTranslation();
    const [data,setData] = useState(saveData.theatres.data[saveData.theatres.pageNow]);
    const [inputPage,setInputPage] = useState(saveData.theatres.pageNow);
    const [totalPages,setTotalPages] = useState(saveData.theatres.totalPages);
    const [curPage,setCurPage] = useState(saveData.theatres.pageNow);
    const [arrButPage,setArrButPage] = useState([]);
    const [indexMorePage,setIndexMorePage] = useState(saveData.theatres.pageMoreNow);
    const [language,setLanguage] = useState(dataSetting.language.sign);
    const callAPI = (url,saveData)=>{
    const xhr = new XMLHttpRequest();
    xhr.onload = ()=>{
        if(xhr.readyState === 4){
            if (xhr.status === 200) {
              if(xhr.responseText!=="")
                saveData(JSON.parse(xhr.response));
            }
            else console.log(`Error ${xhr.status}: ${xhr.statusText}`);
        }
    }
    xhr.open("get",url,true);
    xhr.send();
}
    const getData = ()=>{
        let index;
        if(dataSetting.showPagination) index = curPage;
        else index = indexMorePage;
        if(saveData.theatres.data[index-1]!==undefined&&saveData.theatres.language[index-1]===language){
            if(dataSetting.showPagination){setData(saveData.theatres.data[index-1]);}
            else {setData(concatArr());}
        return;}
        let url = "https://api.themoviedb.org/3/movie/now_playing?api_key="+saveData.apiKey+"&language="+language+"&page="+index;
        callAPI(url,setDataFunc);
    }
    const setDataFunc = (x)=>{
        let index;
        if(dataSetting.showPagination) index = curPage;
        else index = indexMorePage;
        saveData.theatres.language[index-1]=language;
        saveData.theatres.data[index-1] = x.results;
        saveData.theatres.totalPages = x.total_pages;
        setTotalPages(x.total_pages);
        if(dataSetting.showPagination)setData(x.results);
        else setData(concatArr());
    }
    const concatArr = ()=>{
        let arr=[];
        for(let i=0;i<indexMorePage;i++){
            arr=arr.concat(saveData.theatres.data[i]);
        }
        return arr;
    }
    useEffect(()=>{setLanguage(dataSetting.language.sign)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[dataSetting.language]);
    useEffect(()=>{getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[curPage,indexMorePage,language]);
    useEffect(()=>{if(dataSetting.showPagination){CrePagination(setArrButPage,curPage,totalPages)};},[curPage,totalPages]);
    const setCurPageFunc = (x)=>{
        saveData.theatres.pageNow=x;
        setCurPage(x);
        setInputPage(x);    
    }
    const setIndexMorePageFunc = (x)=>{
        saveData.theatres.pageMoreNow = x;
        setIndexMorePage(x);
    }
    return (
        <div>
            <div className="commonContainer">
                <h2> {t("Theatres")} </h2>
                <CardMovie method={"movie"} data={data}/>
                <Pagination arrButPage={arrButPage} curPage={curPage} setCurPageFunc={setCurPageFunc} totalPages={totalPages} inputPage={inputPage} setInputPage={setInputPage} indexMorePage={indexMorePage} setIndexMorePageFunc={setIndexMorePageFunc}/>
            </div>
        </div>
    );
}
export default Theatres;