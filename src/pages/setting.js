import React, {useEffect, useState} from "react";
import dataSetting from "../data/dataSetting";
import "../style/setting.css"
import {useTranslation} from 'react-i18next';

function Setting(){
    const {t} = useTranslation();
    const [showPagination,setShowPagination] = useState();
    function change(type,value){
        let ValueshowPagination = showPagination;
        switch(type){
            case "showPagination": ValueshowPagination = value;break;
            default:break;
        }
        let dataShowPagination = ValueshowPagination;
        localStorage.setItem("showPagination",JSON.stringify(dataShowPagination));
        setting();
    }
    function setting(){
        const getshowPagination = localStorage.getItem("showPagination")?JSON.parse(localStorage.getItem("showPagination")):"";
        if(getshowPagination===""){
            setShowPagination(dataSetting.showPagination);
            return;
        }
        if(getshowPagination) {
            dataSetting.showPagination=true;
            setShowPagination(true);
        }
        else {
            dataSetting.showPagination=false;
            setShowPagination(false);
        }
    }
    useEffect(()=>{setting();},[]);
    return(
        <div className="setting">
        <h1>{t("Setting")}</h1>
        <div className="pagination">
            <h3> {t("Show Pagination")} </h3>
            <input type="checkbox" id="paginationid" onClick={()=>{dataSetting.showPagination=!showPagination;change("showPagination",!showPagination);setShowPagination(!showPagination);}}  defaultChecked={showPagination}/><label htmlFor="paginationid"></label>
        </div>
        </div>
    )
}
export default Setting