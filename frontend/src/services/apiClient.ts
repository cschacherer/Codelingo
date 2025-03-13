import axios, {CanceledError} from "axios";

export default axios.create({
    baseURL: "http://127.0.0.1:5000", 
    // headers: {
    //     'api-key': '123', 
    // }
})

export { CanceledError };