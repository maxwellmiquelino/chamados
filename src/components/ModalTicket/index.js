import { FiX } from 'react-icons/fi';
import './modalticket.css';

export default function ModalTicket({ content, close }) {

    // Retorna a cor do Status
    function getColorStatus(item) {
        if (item === "Aberto")
            return "#5CB85C";
        else if (item === "Andamento")
            return "#F6A935";
        else if (item === "Finalizado")
            return "#3583F6";

    }


    return (
        <div className="modal">
            <div className="container">
                <button className="btn-close" onClick={close}>
                    <FiX size={25} color="#FFF" />
                    FECHAR
                </button>

                <main>
                    <h2>Detalhes do Chamado</h2>

                    <div className="row">
                        <span>
                            Cliente: <i>{content.customerName}</i>
                        </span>
                    </div>
                    <div className="row">
                        <span>
                            Assunto: <i>{content.subject}</i>
                        </span>
                        <span>
                            Cadastrado em: <i>{content.createdFormat}</i>
                        </span>
                    </div>
                    <div className="row">
                        <span>
                            Status: 
                            <i className='status-bagde'
                                style={{
                                    color: "#FFF",
                                    backgroundColor: getColorStatus(content.status)
                                }}>{content.status}</i>
                        </span>
                    </div>
                    {content.complement !== "" && (
                        <>
                            <h3>Complemento</h3>
                            <p>
                                {content.complement}
                            </p>
                        </>
                    )}
                </main>
            </div>
        </div>
    );
}