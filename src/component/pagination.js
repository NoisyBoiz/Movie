import dataSetting from "../data/dataSetting";
import {useTranslation} from 'react-i18next';
function Pagination({arrButPage, curPage, setCurPageFunc, totalPages, inputPage, setInputPage, indexMorePage, setIndexMorePageFunc}){
    const {t} = useTranslation();
    return(
        <div className="bottomCommonContainer">
                {dataSetting.showPagination? <>
                    <button className="prePageCommon" disabled={curPage<=1} onClick={()=>{setCurPageFunc(curPage-1)}}><i className="fa-solid fa-chevron-left"></i></button>
                        <div className="indexPageCommon"> 
                            {arrButPage.length&&arrButPage.map((item,index)=>{
                                return <button key={index} className={item.index===curPage?"focusButtonCommon":"unfocusButtonCommon"} onClick={()=>{setCurPageFunc(item.index)}}> {item.sign} </button>
                            })}
                        </div>
                        <button className="nextPageCommon" disabled={curPage>=totalPages} onClick={()=>{setCurPageFunc(curPage+1)}}><i className="fa-solid fa-chevron-right"></i></button>
                        <div className="inputPageCommon"> <input type="number" value={inputPage} onChange={(e)=>{setInputPage(e.target.value);}} onKeyDown={(e)=>{if(e.key==="Enter"){if(Number(inputPage)>0&&Number(inputPage)<=totalPages)setCurPageFunc(Number(inputPage))}}}/> <span> / {totalPages} </span> 
                    </div>
                </>
                :
                indexMorePage<totalPages?
                <button className="buttonMoreCommon" onClick={()=>{setIndexMorePageFunc(indexMorePage+1)}}> 
                    <span> {t("More")} </span>
                    <i className="fa-solid fa-angles-down"></i>
                </button>:""
                }
        </div>
    )
}
export default Pagination