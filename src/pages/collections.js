import React, {useEffect, useState} from "react";
import {useTranslation} from 'react-i18next';
import { Link } from "react-router-dom";
import CardMovie from "../component/cardMovie";
import saveData from "../data/saveData";
import Pagination from "../component/pagination"
import CrePagination from "../function/updatePagination";
import dataSetting from "../data/dataSetting";
import "../style/collections.css"
function Collections(){
    const {t} = useTranslation();
    const [arrFavorite,setArrFavorite] = useState([]);
    const [dataPage,setDataPage] = useState([]);
    const [totalPages,setTotalPages] = useState();
    const [currentPage,setCurrentPage] = useState(saveData.collections.pageNow);
    const [currentMorePage,setCurrentMorePage] = useState(saveData.collections.pageMoreNow);
    const [postPerPage] = useState(20);
    const [arrButPage,setArrButPage] = useState([]);
    const [inputPage,setInputPage] = useState(currentPage);
    const setCurrentPageFunc = (x)=>{
        saveData.collections.pageNow = x;
        setCurrentPage(x);
    }
    const setCurrentMorePageFunc = (x)=>{
        saveData.collections.pageMoreNow = x;
        setCurrentMorePage(x);
    }
    useEffect(()=>{ 
        const getDataFavorite = localStorage.getItem("dataFavorite")?JSON.parse(localStorage.getItem("dataFavorite")):[];
        setArrFavorite(getDataFavorite);
        setTotalPages(Math.ceil(getDataFavorite.length/postPerPage));
        let arr = getDataFavorite;
        setDataPage(arr.slice(0,Math.min(postPerPage,getDataFavorite.length)));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);
    useEffect(()=>{
        let indexOfFirstPost = 0;
        let indexOfLastPost = Math.min(currentMorePage*postPerPage,arrFavorite.length);
        if(dataSetting.showPagination) {
            indexOfFirstPost = (currentPage-1)*postPerPage;
            indexOfLastPost = Math.min(currentPage*postPerPage,arrFavorite.length);
        }
        if(arrFavorite.length){
            let arr = arrFavorite;
            setDataPage(arr.slice(indexOfFirstPost,indexOfLastPost));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[currentPage,currentMorePage]);
    useEffect(()=>{if(dataSetting.showPagination){CrePagination(setArrButPage,currentPage, totalPages)}},[totalPages,currentPage ]);
    return(
        <>
        <div className="commonContainer">
            {dataPage.length?<>
                <h2> {t("Collections")} </h2>
                <CardMovie method={"favorite"} data={dataPage}/> 
                <Pagination arrButPage={arrButPage} curPage={currentPage} setCurPageFunc={setCurrentPageFunc} totalPages={totalPages} inputPage={inputPage} setInputPage={setInputPage} indexMorePage={currentMorePage} setIndexMorePageFunc={setCurrentMorePageFunc}/>
            </>:
            <div className="emptyCollections"> 
                <img src="https://cdn.glitch.global/f41a9bd0-8a31-41ac-a400-886f727e1815/box.png?v=1684402478245" alt="empty collections"/>
                <h1> There is no data in the collection right now! </h1>
                <h1> Let's explore more </h1>
                <Link to="/"> Back to home </Link>
            </div>
            }       
        </div>
        </>
    )
}
export default Collections;