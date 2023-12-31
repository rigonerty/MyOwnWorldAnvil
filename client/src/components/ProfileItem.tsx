import React from 'react'
import { getUserByIdData } from '../store/users'
import { User } from '../store/user'
import { getArticlesById } from '../models/Tools'
import { Link } from 'react-router-dom'
interface props{
    user:getUserByIdData|User,
    articles: getArticlesById|undefined
}
export const ProfileItem = ({user,articles}:props) => {
  return (
    <div className='profilePage'>
        <div className='profilePageHeader'>
            <img src={user.img}/>
            <h1>{user.username}</h1>
        </div>

        <div>
            <h2>Email: {user.email}</h2>
        </div>
        <h2><Link to="maps">Карты</Link></h2>
        <div className='profilePageArticle'>
            {articles && articles.articles.length
                ?<>
                    {articles.articles.map(a=>{
                        return(
                            <div className='profilePageArticleLink' key={a.id}>
                                <Link to={"article/"+a.id}>{a.name}</Link>
                            </div>
                        )
                    })}
                </>
                :<h2 style={{textAlign:"center",width:"100%"}}>Посты отсутствуют.</h2>
            }
        </div>
    </div>
  )
}
