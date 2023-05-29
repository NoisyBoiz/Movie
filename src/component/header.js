import React, {useEffect, useRef, useState} from "react";
import {useNavigate,Link} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import "../style/header.css";
import Navbar from "./navbar";
import listData from "../data/listData";
import saveData from "../data/saveData";
import DragScrolling from "../function/dragScrolling";
import dataSetting from "../data/dataSetting";
import DarkMode from "../function/darkMode";
import {BsSunFill,BsMoonFill} from 'react-icons/bs';
import {MdLanguage} from 'react-icons/md';
import {BiUserCircle} from 'react-icons/bi';

function Header(){
    const navigate = useNavigate();
    const {t,i18n} = useTranslation();
    const [showSlider, setShowSlider] = useState(false);
    const [showMenuMobi, setShowMenuMobi] = useState(false);
    const [indexGenres, setIndexGenres] = useState([]);
    const [showListCountry, setShowListCountry] = useState(false);
    const [indexCountry, setIndexCountry] = useState(null);
    const [showListSort, setShowListSort] = useState(false);
    const [indexSort, setIndexSort] = useState(null);
    const [directionSort, setDirectionSort] = useState(false);
    const [querySearchNavbar, setQuerySearchNavbar] = useState("");
    const [isDarkMode,setIsDarkMode] = useState();
    const [dropDownLanguage,setDropDownLanguage] = useState(false);
    const [language,setLanguage] = useState({lng:"",sign:""});
    const [userInfor,setUserInfor] = useState(null);
    const sliderRef = useRef(null);
    const menuMobiRef = useRef(null);
    const languageRef = useRef(null);
    let outsideClick = (e)=>{
        if(sliderRef.current!==null)
        if(!sliderRef.current.contains(e.target)) setShowSlider(false);
        if(menuMobiRef.current!==null) 
        if(!menuMobiRef.current.contains(e.target)) setShowMenuMobi(false);
        if(languageRef.current!==null)
        if(!languageRef.current.contains(e.target)) setDropDownLanguage(false);
    }
    useEffect(()=>{
        document.addEventListener("click",(e)=>{outsideClick(e);});
    })
    const updateindexGenres = (x)=>{
        indexGenres.includes(x)?setIndexGenres(indexGenres.filter(item=>item!==x)):setIndexGenres([...indexGenres,x]);
    }
    const searchFunc = ()=>{
        if(querySearchNavbar==="") return;
        document.getElementsByName('searchInput')[0].value="";
        navigate('/search/1/'+querySearchNavbar);
    }
    const filterFunc = ()=>{
        if(indexGenres.length===0&&indexCountry===null&&indexSort===null) return;
        let arrGenres = [];
        for(let i=0;i<indexGenres.length;i++){
            arrGenres.push(listData.genres[indexGenres[i]].id);
        }
        resetDataFilter();
        indexGenres.length&&arrGenres.forEach((x)=>{
            listData.genres.forEach((y)=>{
                if(y.id===x) saveData.filter.genres.push(y.name);
            })
        })
        saveData.filter.sort = indexSort!=null?listData.sort[indexSort].name:"";
        saveData.filter.directionSort = directionSort?"Increase":"Decrease";
        saveData.filter.country = indexCountry!=null?listData.country[indexCountry].sign:"";
        let url =(indexGenres.length?"&with_genres="+arrGenres.join(","):"")+(indexCountry!=null?"&region="+listData.country[indexCountry].sign:"")+(indexSort!=null?"&sort_by="+listData.sort[indexSort].method+(directionSort?".asc":".desc"):"");
        navigate('/search/0/'+url);
    }
    const resetDataFilter = ()=>{
        saveData.filter.sort="";
        saveData.filter.country="";
        while(saveData.filter.genres.length) saveData.filter.genres.pop();
    }
    const getUserInfor = ()=>{
        const userInfor = localStorage.getItem("user-info")?JSON.parse(localStorage.getItem("user-info")):null;
        if(userInfor!==null) setUserInfor(userInfor);
    }
    useEffect(()=>{getUserInfor()},[])
    function change(type,value){
        let ValueisDarkMode = isDarkMode;
        let ValueLanguage = language;
        switch(type){
            case "isDarkMode": ValueisDarkMode = value;break;
            case "language": ValueLanguage = value;break;
            default:break;
        }
        let dataSetting = {isDarkMode:ValueisDarkMode,language:ValueLanguage};
        localStorage.setItem("dataSetting",JSON.stringify(dataSetting));
        setting();
    }

    function setting(){
        const getDataSetting = localStorage.getItem("dataSetting")?JSON.parse(localStorage.getItem("dataSetting")):"";
        if(getDataSetting===""){
            setIsDarkMode(dataSetting.isDarkMode);
            setLanguage(dataSetting.language);
            return;
        }
        if(getDataSetting.isDarkMode) {
            dataSetting.isDarkMode=true;
            setIsDarkMode(true);
        }
        else {
            dataSetting.isDarkMode=false;
            setIsDarkMode(false);
        }
        dataSetting.language = getDataSetting.language;
        setLanguage(getDataSetting.language);
        i18n.changeLanguage(getDataSetting.language.sign);
    }
    const changeLanguage = (lng,sign) => {
        change("language",{lng:lng,sign:sign});
        setLanguage({lng:lng,sign:sign});
        i18n.changeLanguage(sign)
    }
    useEffect(()=>{
        setting()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); 
    return(
        <>
        <div className={`maskOutClick ${(showSlider||showMenuMobi)?"showMaskOutClick":"hiddenMaskOutClick"}`}></div>
        <div className="header" >
            <div className="headerContainer">
                <div className="menuMobi" ref={menuMobiRef}>
                    <i className="fa-solid fa-bars iconMenu" onClick={()=>{setShowMenuMobi(!showMenuMobi)}}></i>
                    <div className={`navbarMobi ${showMenuMobi? "showNavbarMobi":"hiddenNavbarMobi"}`}>
                        <Navbar/>
                    </div>  
                </div>
                <div className="logoWeb"><Link to="/"><h1><span>MO</span><span>VIE</span></h1></Link></div>
                <div ref={sliderRef} className="searchNavBarContainer">
                    <div className="searchInputNavBar">
                        <i onClick={()=>{searchFunc()}} className="searchButtonNavBar fa-solid fa-magnifying-glass"></i>
                        <input type="text" name="searchInput" placeholder={t("Search")} onChange={(e)=>{setQuerySearchNavbar(e.target.value)}} onKeyDown={(e)=>{if(e.key==="Enter"){searchFunc()}}}/>
                        <i className="searchSliderNavBar fa-solid fa-sliders" onClick={()=>{setShowSlider(!showSlider)}}></i> 
                    </div>
                    <div className={showSlider?"showSliderBar":"hiddenSliderBar"} >
                        <button className="buttonFilter" onClick={filterFunc}> {t("Filter")} </button>
                        <div className="sliderSort" onMouseMove={()=>{setShowListSort(true)}} onMouseOut={()=>{setShowListSort(false)}}>
                            <p className={indexSort!=null?"focusSort":"unfocusSort"}> {indexSort==null?t("Arrange"):t(listData.sort[indexSort].name)} <i className={`fa-solid fa-arrow-down ${directionSort?"upSort":"downSort"}`} onClick={()=>{setDirectionSort(!directionSort)}}></i> <button className={`clearIndexSort ${indexSort==null?"addIndexSort":"removeIndexSort"}`} onClick={()=>{setIndexSort(null);}}> + </button> </p>
                            <div className={showListSort?"showListSort":"hiddenListSort"}>
                                <ul>
                                    {listData.sort.map((item, index)=>{
                                        return(
                                            <li key={index} className={indexSort===index?"chooseSort":"unchooseSort"} onClick={()=>{indexSort!==index?setIndexSort(index):setIndexSort(null)}}> {t(item.name)} </li>
                                        )
                                    })}
                                </ul>
                            </div>
                        </div>
                        <div className="sliderGenres" > 
                            <p className={indexGenres.length?"focusGenres":"unfocusGenres"} > <span> {indexGenres.length} </span> {t("Genres")} <button className={`clearIndexGenres ${indexGenres.length?"removeIndexGenres":"addIndexGenres"}`} onClick={()=>{setIndexGenres([]);}}> + </button> </p>
                            <div className="listGenres" onMouseDown={(e)=>{DragScrolling(e,"listGenres")}}>
                                <ul>
                                    {listData.genres.map((item, index)=>{
                                        return(
                                            <li key={index} className={indexGenres.includes(index)?"chooseGenre":"unchooseGenre"} onClick={()=>{updateindexGenres(index)}}>{t(item.name)}<span className={indexGenres.includes(index)?"addIconGenres":"removeIconGenres"}>+</span></li>
                                        )
                                    })}
                                </ul>
                            </div>
                        </div>
                        <div className="sliderCountry" onMouseMove={()=>{setShowListCountry(true)}} onMouseLeave={()=>{setShowListCountry(false)}} >
                            <p className={indexCountry==null?"unfocusCountry":"focusCountry"}> {indexCountry==null?t("Country"):t(listData.country[indexCountry].name)} <button className={`clearIndexCountry ${indexCountry==null?"addIndexCountry":"removeIndexCountry"}`} onClick={()=>{setIndexCountry(null)}}>+</button></p>
                            <div className={`listCountry ${showListCountry?"showListCountry":"hiddenListCountry"}`}>
                                <ul >
                                    {listData.country.map((item, index)=>{
                                        return(
                                            <li key={index} className={indexCountry===index?"chooseCountry":"unchooseCountry"} onClick={()=>{indexCountry!==index?setIndexCountry(index):setIndexCountry(null)}} >{t(item.name)}</li>
                                        )
                                    })}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="userIcon"> 
                    <div className="settingHeader"> 
                        <div className="dropDownLanguage" ref={languageRef}>
                            <p className="gr-language" onClick={()=>{setDropDownLanguage(!dropDownLanguage)}}> <MdLanguage/> </p>
                            <div className={dropDownLanguage?"showDropDownLanguage":"hiddenDropDownLanguage"}>
                                <ul>
                                    <li className={language.sign==='vi'?"focusLanguage":""} onClick={()=>{changeLanguage("Vietnamese","vi")}}> {t("Vietnamese")} </li>
                                    <li className={language.sign==='en'?"focusLanguage":""} onClick={()=>{changeLanguage("English","en")}}> {t("English")} </li>
                                    <li className={language.sign==='fr'?"focusLanguage":""} onClick={()=>{changeLanguage("French","fr")}}> {t("French")} </li>
                                    <li className={language.sign==='th'?"focusLanguage":""} onClick={()=>{changeLanguage("Thai","th")}}> {t("Thai")} </li>
                                    <li className={language.sign==='ko'?"focusLanguage":""} onClick={()=>{changeLanguage("Korean","ko")}}> {t("Korean")} </li>
                                    <li className={language.sign==='cn'?"focusLanguage":""} onClick={()=>{changeLanguage("Chinese","cn")}}> {t("Chinese")} </li>
                                    <li className={language.sign==='de'?"focusLanguage":""} onClick={()=>{changeLanguage("German","de")}}> {t("German")} </li>
                                    <li className={language.sign==='ru'?"focusLanguage":""} onClick={()=>{changeLanguage("Russian","ru")}}> {t("Russian")} </li>
                                    <li className={language.sign==='ja'?"focusLanguage":""} onClick={()=>{changeLanguage("Japanese","ja")}}> {t("Japanese")} </li>
                                    <li className={language.sign==='ar'?"focusLanguage":""} onClick={()=>{changeLanguage("Arabic","ar")}}> {t("Arabic")} </li>
                                    <li className={language.sign==='pt'?"focusLanguage":""} onClick={()=>{changeLanguage("Portuguese","pt")}}> {t("Portuguese")} </li>
                                    <li className={language.sign==='hi'?"focusLanguage":""} onClick={()=>{changeLanguage("Hindi","hi")}}> {t("Hindi")} </li>
                                    <li className={language.sign==='zh'?"focusLanguage":""} onClick={()=>{changeLanguage("Chinese","zh")}}> {t("Chinese")} </li>
                                    <li className={language.sign==='es'?"focusLanguage":""} onClick={()=>{changeLanguage("Spanish","es")}}> {t("Spanish")} </li>
                                </ul>
                            </div>
                    
                        </div>
                        <div className="darkModeHeader">{!isDarkMode?<p className="bs-sun" onClick={()=>{dataSetting.isDarkMode=true;change("isDarkMode",true);setIsDarkMode(true);DarkMode();}}> <BsMoonFill/> </p>:<p className="bs-moon" onClick={()=>{dataSetting.isDarkMode=false;change("isDarkMode",false);setIsDarkMode(false);DarkMode();}}><BsSunFill/></p>}</div>
                    </div>
                    <div className="loginHeader"> {userInfor!==null?<> <p className="bi-user"><BiUserCircle/></p> {userInfor.name} </>:<Link to="/login" className="loginButton"> <p className="bi-user"><BiUserCircle/></p> <span> {t("Sign In")} </span> </Link>} </div>
                </div>
            </div>
            
        </div>
        </>
    )
}
export default Header