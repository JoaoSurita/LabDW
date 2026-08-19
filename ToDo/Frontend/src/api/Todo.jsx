import axios from "axios";
const api = axios.create({
    baseURL:"http://localhost:5000/ToDo",
    headers:{
        "Content-Type": "application/json"
    }
})
export const getTodos=()=>api.get("/getAll")
export const createTodos=(dados)=>api.post("/create", dados) // Alterado para enviar os dados como corpo da requisição
export default api