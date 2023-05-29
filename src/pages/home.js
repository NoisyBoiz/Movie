import React, {useEffect, useRef, useState, useReducer} from "react";
import { Link } from "react-router-dom";
import {useTranslation} from 'react-i18next';
import "../style/home.css";
import "../style/common.css";
import listData from "../data/listData";
import saveData from "../data/saveData";
import dataSetting from "../data/dataSetting";
import CardMovie from "../component/cardMovie";
import CrePagination from "../function/updatePagination";
import Pagination from "../component/pagination"
import SaveFavorite from "../function/saveFavorite"
import StyleTitle from "../function/styleTitle";
import DragScrolling from "../function/dragScrolling";
import {GoStar} from 'react-icons/go';
const initState = {
    backDropImg:"",
    poster_path:"",
    original_title:"",
    title:"",
    overview:"",
    genres:[],
    time:"",
    isComing:false,
    rate_average:0,
    vote_count:0,
    id_movie:null,
}
const reducer = (state,action)=>{
    switch(action.type){
        case "backDropImg": return {...state,backDropImg:action.data};
        case "poster_path": return {...state,poster_path:action.data};
        case "original_title": return {...state,original_title:action.data};
        case "title": return {...state,title:action.data};
        case "overview": return {...state,overview:action.data};
        case "genres": return {...state,genres:action.data};
        case "time": return {...state,time:action.data};
        case "isComing": return {...state,isComing:action.data};
        case "rate_average": return {...state,rate_average:action.data};
        case "vote_count": return {...state,vote_count:action.data};
        case "id_movie": return {...state,id_movie:action.data};
        default: return state;
    }
}
function Home(){
    const {t} = useTranslation();
    const [backdrop, dispatch] = useReducer(reducer, initState);
    const {backDropImg,poster_path,original_title,title,overview,genres,time,isComing,rate_average,vote_count,id_movie} = backdrop;
    const posterURL = useRef("https://image.tmdb.org/t/p/w500");
    const backDropURL = useRef("https://image.tmdb.org/t/p/w1280");
    const isLoad = useRef(false);
    const arrTimeOut = useRef([]);
    const [dataTrendingDay,setDataTrendingDay] = useState([]);
    const [dataTrendingWeek,setDataTrendingWeek] = useState([]);
    const [dataBackDrop,setDataBackDrop] = useState([]);
    const [indexSlide, setIndexSlide] = useState(0);
    const [preIndexSlide, setPreIndexSlide] = useState(0);
    const [trendingTime, setTrendingTime] = useState(saveData.trending.timeNow);
    const [totalPagesPopular,setTotalPagesPopular] = useState(saveData.popular.totalPages);
    const [curPagePopular,setCurPagePopular] = useState(saveData.popular.pageNow);
    const [arrButPagePopular,setArrButPagePopular] = useState([]);
    const [dataPopular,setDataPopular] = useState(null);
    const [inputPage,setInputPage] = useState(saveData.popular.pageNow);
    const [indexMorePage,setIndexMorePage] = useState(saveData.popular.pageMoreNow);
    const [arrFavorite,setArrFavorite] = useState([]);
    const [language,setLanguage] = useState(dataSetting.language.sign);
    const scrollTop = ()=>{
        window.scrollTo(0,0);
    }
    const cmpDate = (x)=>{
        return new Date(x).getTime()>new Date().getTime()?true:false;
    }
    const callAPI = (url,saveData)=>{
        const xhr = new XMLHttpRequest();
        xhr.onload = ()=>{
            if(xhr.readyState === 4&&xhr.status === 200&&xhr.responseText!=="") saveData(JSON.parse(xhr.response));
            else console.log(`Error ${xhr.status}: ${xhr.statusText}`);
        }
        xhr.open("get",url,true);
        xhr.send();
    }
    // get data back drop 
    const getDataBD = ()=>{
        if(saveData.backdrop.data.length!==0&&saveData.backdrop.language===language){setDataBackDrop(saveData.backdrop.data);changeContentBD(saveData.backdrop.data[0]);return;}
        let url = "https://api.themoviedb.org/3/movie/upcoming?api_key="+saveData.apiKey+"&language="+language+"&page=1";
        callAPI(url,setDataBDFunc);
    }
    const setDataBDFunc = (x)=>{
        saveData.backdrop.data=x.results;
        saveData.backdrop.language=language;
        setDataBackDrop(x.results);
        changeContentBD(x.results[0])
    }
    useEffect(()=>{getDataBD();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[language]);
    // get data trending
    const getDataTrending = ()=>{
        if(trendingTime===0&&saveData.trending.data.day.length!==0&&saveData.trending.language.day===language){setDataTrendingDay(saveData.trending.data.day);return;}
        if(trendingTime===1&&saveData.trending.data.week.length!==0&&saveData.trending.language.week===language){setDataTrendingWeek(saveData.trending.data.week);return;}
        let url = "https://api.themoviedb.org/3/trending/all/"+(trendingTime?"week":"day")+"?api_key="+saveData.apiKey+"&language="+language;
        callAPI(url,setDataTrendingFunc);
    }
    const setDataTrendingFunc = (x)=>{
        if(trendingTime===0) {
            setDataTrendingDay(x.results);
            saveData.trending.data.day=x.results;
            saveData.trending.language.day=language;
        }
        else {
            setDataTrendingWeek(x.results);
            saveData.trending.data.week=x.results;
            saveData.trending.language.week=language;
        }
    }
    useEffect(()=>{getDataTrending();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[trendingTime,language]);
    // 
    const changeBackDrop = (x) => {
        document.getElementsByClassName('homeBackDrop')[0].style.opacity = 0;
        setTimeout(()=>{
            changeContentBD(x);
            setTimeout(()=>{
                if(document.getElementsByClassName('homeBackDrop')[0]!==undefined)
                document.getElementsByClassName('homeBackDrop')[0].style.opacity = 1;
            },20);
        },360);
    }
    const changeContentBD = (item) => {
            //set backdrop img
            dispatch({type:"backDropImg",data:item.backdrop_path});
            dispatch({type:"poster_path",data:item.poster_path});
            //set title
            let title = item.title?item.title:item.name;
            dispatch({type:"original_title",data:title});
            dispatch({type:"title",data:StyleTitle(title.toLowerCase())});
            dispatch({type:"overview",data:item.overview});
            //set genres
            dispatch({type:"id_movie",data:item.id});
            let genresID = [];
            item.genre_ids.forEach((x)=>{
                listData.genres.forEach((y)=>{
                    if(y.id===x) genresID.push(y.name);
                })
            })
            dispatch({type:"genres",data:genresID});
            let mDate = item.release_date?item.release_date:item.first_air_date;
            dispatch({type:"time",data:mDate});
            dispatch({type:"isComing",data:cmpDate(mDate)});
            dispatch({type:"rate_average",data:Math.floor(item.vote_average*10)/10});
            dispatch({type:"vote_count",data:item.vote_count});
    }
   
    
    // animation slide backdrop
    const moveSlideBackDrop = (x)=>{
        while(arrTimeOut.current.length) clearTimeout(arrTimeOut.current.pop());
        if(x!==preIndexSlide&&document.querySelector('.homePosterBox')!==null){
            setIndexSlide(x);
            let n=x;
            if(x<preIndexSlide) n--;
            let width = document.querySelector('.homePosterBox').offsetWidth;
            if(n===1) width=width/1.5;
            if(n>saveData.backdrop.data.length/2) {
                if(x>preIndexSlide) width=width*1.09;
                else width=width*1.16;
            }
            document.getElementsByClassName('homeSlideCard')[0].scrollTo({left:width*n,top: 0,behavior:'smooth'});
            setPreIndexSlide(x);
        }
    }
    const timeSlide = ()=>{
        if(indexSlide<saveData.backdrop.data.length-1) moveSlideBackDrop(indexSlide+1);
        else moveSlideBackDrop(0);
        while(arrTimeOut.current.length) clearTimeout(arrTimeOut.current.pop());
    }
    useEffect(()=>{
        if(isLoad.current===true) {changeBackDrop(dataBackDrop[indexSlide]);}
        else isLoad.current=true;
        arrTimeOut.current.push(setTimeout(timeSlide,5000));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[indexSlide]);
    
    //Animation change Trending Time
    useEffect(()=>{
        let hiddenElement,showELement,hiddenImg,showImg;
        if(trendingTime){
            hiddenElement = document.getElementsByClassName("trendingSlideDay");
            showELement = document.getElementsByClassName("trendingSlideWeek");
            hiddenImg = document.getElementsByClassName("styleImgTrending1");
            showImg = document.getElementsByClassName("styleImgTrending2");
        }
        else {
            hiddenElement = document.getElementsByClassName("trendingSlideWeek");
            showELement = document.getElementsByClassName("trendingSlideDay");
            hiddenImg = document.getElementsByClassName("styleImgTrending2");
            showImg = document.getElementsByClassName("styleImgTrending1");
        }
        if(hiddenElement[0]!==undefined) hiddenElement[0].style.opacity = "0";
        if(hiddenImg!==undefined)
        Array.from(hiddenImg).forEach((element,index) => {
            element.style.transform = "translateY(-100%)";
            element.style.transitionDelay = 0.05*index+"s";
        });
        setTimeout(()=>{
            if(hiddenElement[0]!==undefined) hiddenElement[0].style.display = "none";
            setTimeout(()=>{
                if(showELement[0]!==undefined){
                    showELement[0].style.display = "flex";
                    showELement[0].style.opacity= 0;
                    if(showImg!==undefined) Array.from(showImg).forEach(element =>{element.style.transform = "translateY(100%)";});
                    showELement[0].scrollTo({left:0,top: 0});
                }
                setTimeout(()=>{
                    if(showELement[0]!==undefined) showELement[0].style.opacity = 1;
                    if(showImg[0]!==undefined)
                    Array.from(showImg).forEach((element,index) => {
                        element.style.transform = "translateY(0%)";
                        element.style.transitionDelay = 0.05*index+"s";
                    });
                },20);
            },20);
        },500);
    },[trendingTime])
    const getDataPopular = ()=>{
        let index;
        if(dataSetting.showPagination) index = curPagePopular;
        else index = indexMorePage;
        if(saveData.popular.data[index-1]!==undefined&&saveData.popular.language[index-1]===language){
            if(dataSetting.showPagination){setDataPopular(saveData.popular.data[index-1]);}
            else {setDataPopular(concatArrPopular());}
        return;}
        let url = "https://api.themoviedb.org/3/movie/popular?api_key="+saveData.apiKey+"&language="+language+"&page="+index;
        callAPI(url,setDataPopularFunc);
    }
    const setDataPopularFunc = (x)=>{
        let index;
        if(dataSetting.showPagination) index = curPagePopular;
        else index = indexMorePage;
        saveData.popular.language[index-1]=language;
        saveData.popular.data[index-1] = x.results;
        saveData.popular.totalPages = x.total_pages;
        setTotalPagesPopular(x.total_pages);
        if(dataSetting.showPagination)setDataPopular(x.results);
        else setDataPopular(concatArrPopular());
    }
    const concatArrPopular = ()=>{
        let arr=[];
        for(let i=0;i<indexMorePage;i++){
            arr=arr.concat(saveData.popular.data[i]);
        }
        return arr;
    }
    useEffect(()=>{if(dataSetting.showPagination){CrePagination(setArrButPagePopular,curPagePopular,totalPagesPopular)}},[totalPagesPopular,curPagePopular]);
    useEffect(()=>{getDataPopular();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[indexMorePage,curPagePopular,language]);
    const setCurPagePopularFunc = (x)=>{
        saveData.popular.pageNow=x;
        setCurPagePopular(x);
        setInputPage(x);    
    }
    const setIndexMorePageFunc = (x)=>{
        saveData.popular.pageMoreNow=x;
        setIndexMorePage(x);
    }
    useEffect(()=>{setLanguage(dataSetting.language.sign)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[dataSetting.language]);
    useEffect(()=>{ 
        const getDataFavorite = localStorage.getItem("dataFavorite")?JSON.parse(localStorage.getItem("dataFavorite")):[];
        setArrFavorite(getDataFavorite);
    },[]);
    return(
        <>
        <div className="home">
            <div className="homeTop"> 
                <div className="homeBackDrop" > 
                    <div className="imgBackDrop"><img src={dataBackDrop.length&&backDropURL.current+backDropImg} alt="backdrop"/></div>
                    <div className="backDropContent"> 
                        <div className="topBDContent">
                            <div className="backDropComing" style={isComing?{opacity:1}:{opacity:0}}> {t("Coming Soon")} </div>
                            <div className="bottomTBDContent">
                                <span className="backDropTime"> {time} </span>
                                <span className="backDropRate"> <span className="rateAverage"> <p> <GoStar/> </p> {rate_average} </span>  <span className="backDropVoteCount"> {vote_count} </span> </span> 
                                <div className="backDropGenres"> 
                                    {genres.map((item,index)=>{
                                        return(<div key={index}>{t(item)}</div>)
                                    })}
                                </div>
                            </div>
                        </div>
                        <div className="backDropTitle">{title}</div>
                        <div className="backDropOverview">{overview}</div>
                        <div className="bottomBDContent">
                            <Link to={"/detail/movie/"+id_movie} className="buttonDetailBD" onClick={scrollTop}>
                                <button> {t("Detail")} </button>
                            </Link>
                            <button className={`buttonFavoriteBD ${arrFavorite.find(item=>item.id===id_movie)?"activeFavorite":"inactiveFavorite"}`} 
                                onClick={()=>{SaveFavorite(setArrFavorite,id_movie,"movie",poster_path,original_title,time,rate_average)}}
                            > <i className="fa-solid fa-heart"></i> {t("Favorite")} </button>
                        </div>
                    </div>
                </div>
                <div className="homeSlideContainer">
                    <div className="homeSlideCard">
                        {dataBackDrop.length&&dataBackDrop.map((item,index)=>{
                            return(
                                <div key = {item.id} className="homePosterBox" onClick={()=>{moveSlideBackDrop(index)}}>
                                    <img src={posterURL.current+item.poster_path} alt="backdrop" className={indexSlide===index?"focusPoster":"unfocusPoster"}/>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            <div className="homeContent">
                <div className="trendingContainer">
                    <div className="timeTrending"> <h2>{t("Trending")}</h2> <button onClick={()=>{setTrendingTime(0);saveData.timeNow=0}} className={trendingTime?"unfocusTrendingTime":"focusTrendingTime"}> {t("Day")} </button> <button onClick={()=>{setTrendingTime(1);saveData.trending.timeNow=1;}} className={trendingTime?"focusTrendingTime":"unfocusTrendingTime"}> {t("Week")} </button></div>
                    <div className="trendingBox">
                        <div className="trendingSlide trendingSlideDay" onMouseDown={(e)=>{DragScrolling(e,'trendingSlideDay')}} >
                            {dataTrendingDay.length&&dataTrendingDay.map((item,index)=>{
                                return(
                                    <div key = {index} className="trendingCard styleImgTrending1">
                                        <Link to={"/detail/movie/"+item.id} key = {item.id} onClick={scrollTop}>
                                            <img src={posterURL.current+item.poster_path} alt="Trending" />
                                            {cmpDate(item.release_date?item.release_date:item.first_air_date)&&<p className="trendingCardComing">{t("Coming Soon")}</p>}
                                            <p className="trendingCardRate"> {Math.floor(item.vote_average*10)/10} </p>
                                            <div className="trendingCardContent">
                                                <p className="trendingCardName"> {item.title?item.title:item.name} </p>
                                                <p className="trendingCardDay"> {item.release_date?item.release_date:item.first_air_date} </p>
                                            </div>
                                        </Link>
                                    </div>
                                )
                            })}
                        </div>
                        <div className="trendingSlide trendingSlideWeek" onMouseDown={(e)=>{DragScrolling(e,'trendingSlideWeek')}} >
                            {dataTrendingWeek.length&&dataTrendingWeek.map((item,index)=>{
                                return(
                                    <div key = {index} className="trendingCard styleImgTrending2">
                                        <Link to={"/detail/movie/"+item.id} key = {item.id} onClick={scrollTop}>
                                            <img src={posterURL.current+item.poster_path} alt="Trending" />
                                            <p className="trendingCardRate"> {Math.floor(item.vote_average*10)/10} </p>
                                            <div className="trendingCardContent">
                                                <p className="trendingCardName"> {item.title?item.title:item.name} </p>
                                                <p className="trendingCardDay"> {item.release_date?item.release_date:item.first_air_date} </p>
                                            </div>
                                        </Link>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
                <div className="commonContainer">
                    <h2> {t("Popular")} </h2>
                    <CardMovie method={"movie"} data={dataPopular}/>
                    <Pagination arrButPage={arrButPagePopular} curPage={curPagePopular} setCurPageFunc={setCurPagePopularFunc} totalPages={totalPagesPopular} inputPage={inputPage} setInputPage={setInputPage} indexMorePage={indexMorePage} setIndexMorePageFunc={setIndexMorePageFunc}/>
                </div>
            </div>

        </div>
        </>
    )
}
export default Home