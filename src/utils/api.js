import axios from 'axios';
import { Message } from 'element-ui';
import router from '../router'


/*
 * 调用接口前的请求拦截器
 */
axios.interceptors.request.use(config =>{
        //判断是否携带tokenStr 携带就将tokenStr放入请求头中
        if(window.sessionStorage.getItem("tokenStr")){
            config.headers['authorization'] = window.sessionStorage.getItem("tokenStr");
        }
        return config;
},error => {
         console.log(error);
})


/*
 * 调用接口后的响应拦截器 做一些判断操作 进行提示!
 */
axios.interceptors.response.use(success => {
    if (success.status && success.status==200){
        const resultCode = success.data.code;
        const resultMessage = success.data.message;
        if(resultCode == 504 || resultCode == 401 || resultCode == 402){
            //后端响应的消息
            Message.error({message:resultMessage});
            return;
        }
        if(resultMessage){
            Message.success({message:resultMessage});
        }
    }
    return success.data;
},error => {
    const resCode = error.response.code;
    if(resCode == 504 || resCode == 404){
        Message.error({message:'服务器被吃了( ╯□╰ )'});
    }else if(resCode == 403){
        Message.error({message:'权限不足请联系管理员'});
    }else if(resCode == 401){
        Message.error({message:'尚未登录,请登录'});
        router.replace('/');
    }else{
      const resMessage =   error.response.data.message;
       if(resMessage){
           Message.error({message:resMessage});
       }else{
           Message.error({message:'未知错误!'});
       }
    }
    return;
})

let base = '';

/*
 * json格式的get请求
 */
export const getRequest = (url,params) => {
    return axios({
        methods:'get',
        url:'${base}${url}',
        data:params,
    })
}


/*
 * json格式的post请求
 */
export const postRequest = (url,params) => {
    return axios({
        methods:'post',
        url:'${base}${url}',
        data:params,
    })
}

/*
 * json格式的put请求
 */
export const putRequest = (url,params) => {
    return axios({
        methods:'put',
        url:'${base}${url}',
        data:params,
    })
}

/*
 * json格式的delete请求
 */
export const deleteRequest = (url,params) => {
    return axios({
        methods:'delete',
        url:'${base}${url}',
        data:params,
    })
}

