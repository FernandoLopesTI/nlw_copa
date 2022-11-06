import axios from "axios";

export const api = axios.create({
  baseURL: 'http://192.168.12.115:3333'
  
})