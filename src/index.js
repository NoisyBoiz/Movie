import React,{useEffect}  from 'react';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom" 
import ReactDOM from 'react-dom/client';
import "./i18n/i18n";
import {publicRoutes} from './router/routes';
import Layout from './layout';
import dataSetting from './data/dataSetting';
import DarkMode from './function/darkMode';
import { useTranslation } from 'react-i18next';
import "./style/globalStyle.css";
function Main(){
  const {i18n} = useTranslation();
  function setting(){
    const getDataSetting = localStorage.getItem("dataSetting")?JSON.parse(localStorage.getItem("dataSetting")):"";
    if(getDataSetting==="") return;
    if(getDataSetting.showPagination) dataSetting.showPagination=true;
    else dataSetting.showPagination=false;
    if(getDataSetting.isDarkMode) dataSetting.isDarkMode=true;
    else dataSetting.isDarkMode=false;
    dataSetting.language = getDataSetting.language;
    i18n.changeLanguage(getDataSetting.language.sign);
    DarkMode();
}
useEffect(()=>{
  setting();
// eslint-disable-next-line react-hooks/exhaustive-deps
},[]);
  return(
    <>
      <Router>
        <Routes>
          {publicRoutes.map((route,index)=>{
              const LayoutPage = route.layout===null?React.Fragment:Layout;
              return(
                <Route key={index} path={route.path} element={<LayoutPage><route.component/></LayoutPage>}/>
              )
            })}
        </Routes>
      </Router>
    </>
  )
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Main/>);

