import React , {useEffect , useState, UseState} from 'react'
import {Card , FormField , Loader} from '../components'


const RenderCards = ({data , title}) =>{
  if(data?.length > 0 ){
    return data.map((post)=>
      <Card key = {post._id} {...post} />)
  }
  else{
    return <h2 className='mt-5 font-bold text-blue-500 ' >{title}</h2>
  }
}


const Home = () => {

  const [loading , setLoading] = useState(false) ;
  const [allPosts , setAllPosts] = useState(null) ;
  const [searchText , setSearchText] = useState('') ;
  const [searchResults, setSearchResults] = useState(null)
  const [searchTimeout, setSearchTimeout] = useState(null)

  useEffect(() => {

    const fetchPosts  = async ()=>{
      setLoading(true) ;

      try{
        const response = await fetch('https://dall-e-4ixh.onrender.com/api/v1/post' , {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if(response.ok){
          const result = await response.json() ;
          setAllPosts(result.data.reverse()) ;
        }

      }catch(error){
        alert(error) ;

      }finally{
        setLoading(false) ;
      }
    }

    fetchPosts() ;

  },[]); 


  const handleSearchChange = (e) =>{
    clearTimeout(searchTimeout) ;
    setSearchText(e.target.value) ;

    setSearchTimeout(

      setTimeout(()=>{
        const searchedResults = allPosts.filter((item) => item.name.toLowerCase().includes(searchText.toLowerCase()) || item.prompt.toLowerCase().includes(searchText.toLowerCase())) ;
  
        setSearchResults(searchedResults)
      },500)
    )
  }



  return (
    
    <section className=' max-w-7xl mx-auto ' >

      {/* TITLE TEXT ON HOME PAGE  */}

      <div>
        <h1 className=' font-extrabold text-[32px] '>
          The Community Showcase
        </h1>
        <p className=' mt-3 text-[15px] text-gray-400 '>
          Browse through a collection of imaginative and 
          visually stunning image generated by DALL-E-AI
        </p>
      </div>

      <div className='mt-16'>
        <FormField 
          LabelName= "Search Posts"
          type= "text"
          name= 'text'
          placeholder="Search Posts"
          value={searchText}
          handleChange = {handleSearchChange}
        />
      </div>

      <div className=' mt-10 '>

        {loading ? 
          (<div className=" flex justify-center items-center ">
            <Loader/>
          </div> ): (

          <div className=' font-medium text-gray-400 mb-3 '> 
            {searchText && <h2>
              Showing result for <span className='text-gray-600 '>{searchText}</span>
              </h2>}
          </div>
        )}

        <div className='grid lg:grid-cols-4 sm:grid-cols-3 xs:grid-cols-2 grid-cols-1 gap-3 '>
              
              {/* if searching anything thrn return search result */}
              {searchText ? (       
                <RenderCards
                  data = {searchResults}
                  title = "No Search Result Found"
                />
              ):
              // {/* if not searching anything then return ALL POST */}
              <RenderCards
                  data = {allPosts}
                  title = "No Post Yet"
              />
              }
        </div>



      </div>


    </section>
  )
}

export default Home