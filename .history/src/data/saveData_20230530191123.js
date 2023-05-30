export const saveData = {
    apiKey: // your API key,
    backdrop:{
        data:[],
        language:"",
    },
    trending:{
        data:{
            day:[],
            week:[]
        },
        language:{
            day:"",
            week:""
        },
        timeNow:0
    },
    popular:{
        data:[],
        language:[],
        pageNow:1,
        pageMoreNow:1,
        totalPages:0
    },
    theatres:{
        data:[],
        language:[],
        pageNow:1,
        pageMoreNow:1,
        totalPages:0
    },
    search:{
        data:[],
        language:[],
        pageNow:1,
        pageMoreNow:1,
        totalPages:0,
    },
    filter:{
        sort:"",
        directionSort:"",
        genres:[],
        country:"",
    },
    tvShows:{
        popular:{
            data:[],
            language:[],
            pageNow:1,
            pageMoreNow:1,
            totalPages:0
        },
        topRate:{
            data:[],
            language:[],
            pageNow:1,
            pageMoreNow:1,
            totalPages:0
        },
        airingToday:{
            data:[],
            language:[],
            pageNow:1,
            pageMoreNow:1,
            totalPages:0
        },
        onTheAir:{
            data:[],
            language:[],
            pageNow:1,
            pageMoreNow:1,
            totalPages:0
        }
    },
    collections:{
        pageNow:1,
        pageMoreNow:1,
    }
}
export default saveData;