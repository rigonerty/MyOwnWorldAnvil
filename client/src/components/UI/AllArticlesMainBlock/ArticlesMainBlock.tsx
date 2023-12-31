import { useEffect, useState } from 'react'
import { TextEditor } from '../TextEditor/TextEditor'
import { EditorState} from 'draft-js'
import { options } from '../TextEditor/BlockRenderFunction'
import { stateToHTML } from 'draft-js-export-html'
import { Input } from '../Input/Input'
import { convertToRaw } from 'draft-js'
import { appUseSelector } from '../../../hooks/reduxHooks'
import cl from "./ArticlesMainBlock.module.css"
import { Article } from '../../../models/Tools'
import { convertFromRaw } from 'draft-js'
interface props{
  index: number,
  updateHTML:({index,main,sidebar}:updateHTML)=> void,
  setToggleFocus: ([editorState, setEditorState]: any) => void;
  type?:string;
  value?:{roles?:string[],name:string;main:any;sidebar:any}
}
export interface updateHTML{
  index:number,
  main:string,
  sidebar:string,
  jsonMain: any,
  jsonSidebar: any,
  name:string;
  roles?: string[];
}
export const ArticlesMainBlock = ({index,updateHTML,setToggleFocus,type, value}:props) => {
  const [isBlockName, setBlockName] = useState(value?value.name:"")
  const [isMain, setMain] = useState(value?EditorState.createWithContent(convertFromRaw(value.main)):EditorState.createEmpty())
  const [isSideBar, setSideBar] = useState(value?EditorState.createWithContent(convertFromRaw(value.sidebar)):EditorState.createEmpty())
  const [isSecretValue, setSecretValue] = useState<string[]>([])
  const roles = appUseSelector(state=> state.user.roles)
  useEffect(()=>{
      const isMainContent = isMain.getCurrentContent() 
      const stateMain = stateToHTML(isMainContent,options)
      const isSideBarContent = isSideBar.getCurrentContent() 
      const stateSidebar = stateToHTML(isSideBarContent,options)
      const data = {
        index,
        main:stateMain,
        sidebar:stateSidebar,
        jsonMain: convertToRaw(isMainContent),
        jsonSidebar: convertToRaw(isSideBarContent),
        name:isBlockName,
        roles:isSecretValue
      }
    updateHTML(data)
  },[isMain, isSideBar,isBlockName,isSecretValue])
  const Secrets=(e:string)=>{
    if(roles){
      const newRoles = [] 
      let access = false
      for(const role of roles[0]){
        if(role ===e){
          access=true
        }  
        if(access) {
          newRoles.push(role)
        } 
      }      
      setSecretValue(newRoles)
    }
  }
  useEffect(()=>{
      if(value&&value.roles){
        const roles = []
        for(const Role of value.roles){
          roles.push(Role.split(" ")[0])
        }
        setSecretValue(roles)
      }
      else if(roles) setSecretValue(roles[0])
  },[])
  return (
    <>
      {
      type==="secret" &&
        <>
          <select onChange={(e)=> Secrets(e.target.value)} className={cl.SelectRole}>
            {roles&&
              roles[0].map(a=>{
                if(value&& value.roles&&a===value.roles[0].split(" ")[0]){
                  return <option value={a} selected>{a}</option>
                }
                return <option value={a}>{a}</option>
              })
            }
          </select>
        </>
      }
      <Input name='Название Блока' value={isBlockName} setValue={setBlockName} placeholder='Введите название блока' max={100}/>
      <h2>Основная часть</h2>
      <TextEditor editorState={isMain} setEditorState={setMain} setToggleFocus={setToggleFocus}/>         
      <h2>Сайдбар</h2>
      <TextEditor editorState={isSideBar} setEditorState={setSideBar} setToggleFocus={setToggleFocus}/>
      <hr/>
    </>
 )
}
