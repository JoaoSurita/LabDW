import mongoose from "../db/conn.js";
const {Schema} = mongoose;
// Situações possíveis de uma tarefa
export const SITUACOES = ["PENDENTE", "CANCELADA", "FINALIZADA"];
const tarefaSchema = new Schema({
    titulo:{
        type: String,
        required: true,
    },
    descricao:{
        type:String,
        required: true,
    },
    dataLimite:{
        type:Date,
        required:true,
    },
    situacao:{
        type:String,
        enum: SITUACOES,
        default: "PENDENTE",
    },
    criadoPor:{
        type: Schema.Types.ObjectId,
        ref: "Usuario",
        required: true,
    },
    participam:[{
        type: Schema.Types.ObjectId,
        ref:"Usuario"
    }]
},{timestamps:true});
const Tarefa = mongoose.model('Tarefa', tarefaSchema);
export default Tarefa;