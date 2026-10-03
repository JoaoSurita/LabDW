import {useState, useEffect, useRef} from "react";
//função tratar conversões data falada 
function interpretarDataVoz(texto){
    const fala = texto.toLowerCase().trim();
    const hoje = new Date();
    if(fala.includes("hoje")){
        return hoje.toISOString().split("T")[0];
    }
    if(fala.includes("amanhã") ||fala.includes("amanha")){
        const amanha = new Date();
        amanha.setDate(hoje.getDate()+1);
        return amanha.toISOString().split("T")[0];
    }
    if(fala.includes("depois de amanhã") ||fala.includes("depois de amanha")){
        const depoisAmanha = new Date();
        depoisAmanha.setDate(hoje.getDate()+2);
        return depoisAmanha.toISOString().split("T")[0];
    }
    const matchDias = fala.match(/daqui a (\d+) dias/);
    if(matchDias){
      const dias = parseInt(matchDias[1], 10);
      const dataFutura = new Date();
      dataFutura.setDate(hoje.getDate() + dias);
        return dataFutura.toISOString().split("T")[0];
    }
    return "";
} //fim da função 
export function useVoiceRecognition(){
    const [textoOuvido, setTextoOuvido] = useState("");
    const [ouvindo, setOuvindo] = useState(false);
    const [suportado, setSuportado] = useState(true);
    const recognitionRef = useRef(null);
    useEffect(()=>{
        //verifica se a api está disponível no navegador
        if (typeof window !== "undefined") {
            
            const SpeechRecognition =
            window.SpeechRecognition || window.webkitSpeechRecognition;
            if(SpeechRecognition)
            {
                console.log("estou aqui");
                const recognition = new SpeechRecognition();
                //microfone ficar contínuo
                recognition.continuous = true;
                //permitir capturar e processar 
                // os trechos parciais enquanto o usuário fala
                recognition.interimResults = true;
                //confirmar o idioma 
                recognition.lang = "pt-BR";
                //evento dispara quando o áudio é processado 
                //convertendo em texto
                recognition.onresult = (event)=>{
                    let transcricaoFinal = "";
                    //acumula todos os trechos da fala confirmados
                    //durante a sessão ativa
                    for(let i = event.resultIndex; i < event.results.length; i++){
                        if(event.results[i].isFinal){
                            transcricaoFinal += event.results[i][0].transcript + " ";
                        }
                    }
                    if(transcricaoFinal){
                        setTextoOuvido(transcricaoFinal.trim());
                    }
                };
                //evento erro
                recognition.onerror = (event)=>{
                    console.error("Erro no reconhecimento de voz", event.error);
                    setOuvindo(false);
                };
                //fim da fala
                recognition.onend = ()=>{
                    setOuvindo(false);
                };
                recognitionRef.current = recognition;
            }
            else
            {
                setSuportado(false);
            }   
        }
    }, []);
    //inica ou interrompe a gravação (liga/desliga)
    const iniciarEscuta = ()=>{
        if(!recognitionRef.current) return;
        if(ouvindo){
            //se já estiver ouvindo o click manual encerra a gravação
            recognitionRef.current.stop();
            setOuvindo(false);
        }
        else
        {
            //limpa textos e inicia a escuta
            setTextoOuvido("");
            setOuvindo(true);
            recognitionRef.current.start();
        }
    };
    //função para parar gravação manualmente
    const pararEscuta = ()=>{
        if(recognitionRef.current && ouvindo){
            recognitionRef.current.stop();
            setOuvindo(false);
        }
    };
    //processar a frase capturada e atualiza o estado correspondente
    //baseado na palavra-chave
    const processarComandoVoz = (
        fala,
        setTitulo,
        setDescricao,
        setDataLimite,
        usuarios = [],
        handleCheckboxChange)=>{
            //expressões regulares
            const regexTitulo = /(?:título|titulo)\s+(.+)/i;
            const regexDescricao = /(?:descrição|descricao)\s+(.+)/i;
            const regexData = /(?:data|data limite|prazo)\s+(.+)/i;
            const regexParticipante = /(?:participante|participantes|adicionar|incluir)\s+(.+)/i;
            //comando do participante
            const matchParticipante = fala.match(regexParticipante);
            if(matchParticipante && matchParticipante[1] && handleCheckboxChange)
            {
                const nomeFalado = matchParticipante[1].trim().toLowerCase();
                //buscar na lista de usuários um nome equivalente ao que foi falado
                const usuarioEncontrado = usuarios
                            .find(u=>u.nome.toLowerCase()
                            .includes(nomeFalado));
                if(usuarioEncontrado){
                    const id = usuarioEncontrado._id || usuarioEncontrado.id;
                    handleCheckboxChange(id);
                }
                else
                {
                    console.warn("Usuário não encontrado na lista:", nomeFalado);
                }
                return;
                
            }
            //comando de título
            const matchTitulo = fala.match(regexTitulo);
            if(matchTitulo && matchTitulo[1])
            {
                setTitulo(matchTitulo[1].trim());
                return;
            }
            const matchDescricao = fala.match(regexDescricao);
            if(matchDescricao && matchDescricao[1])
            {
                setDescricao(matchDescricao[1].trim());
                return;
            }
            const matchData = fala.match(regexData);
            if(matchData && matchData[1])
            {
                const dataFormatada = interpretarDataVoz(matchData[1]);
                if(dataFormatada)
                {
                   setDataLimite(dataFormatada);
                }
                return;
            }
            //não deu nenhum match
        };
        return{
            textoOuvido,
            setTextoOuvido,
            ouvindo,
            iniciarEscuta,
            pararEscuta,
            processarComandoVoz,
            suportado
        };
} 