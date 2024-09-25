import { AuthContext } from "../../contexts/auth";
import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { FiPlus, FiMessageSquare, FiSearch, FiEdit2 } from "react-icons/fi";
import { db } from "../../services/firebaseConnection";
import { collection, getDocs, orderBy, limit, startAfter, query } from "firebase/firestore";
import { format } from 'date-fns';
import Header from "../../components/Header";
import Title from '../../components/Title';
import ModalTicket from '../../components/ModalTicket';
import '../Dashboard/dashboard.css';

const listRef = collection(db, "tickets");

export default function Dashboard() {
    const { logout } = useContext(AuthContext);
    const [ticket, setTicket] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEmpty, setIsEmpty] = useState(false);
    const [lastDocs, setLastDocs] = useState();
    const [loadingMore, setLoadingMore] = useState(false);
    const [showPostModal, setShowModalPost] = useState(false);
    const [detail, setDetail] = useState();

    useEffect(() => {
        async function loadTickets() {
            const q = query(listRef, orderBy("created", "desc"), limit(5));

            const querySnapshot = await getDocs(q);
            setTicket([]);
            await updateState(querySnapshot);
            setLoading(false);
        }

        loadTickets();

        return () => { }
    }, []);

    async function updateState(querySnapshot) {
        const isCollectionEmpty = querySnapshot.size === 0;

        if (!isCollectionEmpty) {
            let list = [];
            querySnapshot.forEach((doc) => {
                list.push({
                    id: doc.id,
                    subject: doc.data().subject,
                    customerId: doc.data().customerId,
                    customerName: doc.data().customerName,
                    created: doc.data().created,
                    createdFormat: format(doc.data().created.toDate(), "dd/MM/yyyy"),
                    status: doc.data().status,
                    complement: doc.data().complement
                });
            });

            // Pegar o último item da lista de tickets
            const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];

            setTicket(ticket => [...ticket, ...list]);
            setLastDocs(lastDoc);
        } else {
            setIsEmpty(true);
        }

        setLoadingMore(false);
    }

    async function handleMore() {
        setLoadingMore(true);

        const q = query(listRef, orderBy("created", "desc"), startAfter(lastDocs), limit(5));
        const querySnapshot = await getDocs(q);
        await updateState(querySnapshot);
    }

    // Retorna a cor do Status
    function getColorStatus(item) {
        if (item === "Aberto")
            return "#5CB85C";
        else if (item === "Andamento")
            return "#F6A935";
        else if (item === "Finalizado")
            return "#3583F6";

    }

    function toggleModal(item) {
        setShowModalPost(!showPostModal);
        setDetail(item);
    }

    // Renderizar elemento carregando
    if (loading) {
        return (
            <div>
                <Header />
                <div className="content">
                    <Title name="Meus Tickets">
                        <FiMessageSquare size={25} />
                    </Title>

                    <div className="container dashboard">
                        <span>Listando tickets ...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Header />
            <div className='content'>
                <Title name="Meus Tickets">
                    <FiMessageSquare size={25} />
                </Title>

                <>
                    {
                        ticket.length === 0 ? (
                            <div className="container dashboard">
                                <span>Nenhum ticket encontrado !!!</span>
                                <Link to="/newTicket" className="new-ticket">
                                    <FiPlus color="#FFF" size={25} />
                                    NOVO TICKET
                                </Link>
                            </div>
                        ) : (
                            <>
                                <Link to="/newticket" className="new-ticket">
                                    <FiPlus color="#FFF" size={25} />
                                    NOVO TICKET
                                </Link>
                                <table>
                                    <thead>
                                        <tr>
                                            <th scope="col">CLIENTE</th>
                                            <th scope="col">ASSUNTO</th>
                                            <th scope="col">STATUS</th>
                                            <th scope="col">CADASTRADO EM</th>
                                            <th scope="col"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            ticket.map((item, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td data-label="Cliente">{item.customerName}</td>
                                                        <td data-label="Assunto">{item.subject}</td>
                                                        <td data-label="Status">
                                                            <span className="badge"
                                                                style={{ backgroundColor: getColorStatus(item.status) }}>
                                                                {item.status}
                                                            </span>
                                                        </td>
                                                        <td data-label="Cadastrado">{item.createdFormat}</td>
                                                        <td data-label="#">
                                                            <button
                                                                className="action-btn"
                                                                style={{ backgroundColor: '#3583F6' }}
                                                                onClick={() => { toggleModal(item) }}
                                                            >
                                                                <FiSearch color="#FFF" size={18} />
                                                            </button>
                                                            <Link to={`/newticket/${item.id}`} className="action-btn" style={{ backgroundColor: '#F6A935' }}>
                                                                <FiEdit2 color="#FFF" size={18} />
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        }
                                    </tbody>
                                </table>

                                {loadingMore && <h3>Listar mais tickets...</h3>}
                                {!loadingMore && !isEmpty && <button onClick={handleMore} className="btn-more">BUSCAR MAIS</button>}
                            </>
                        )
                    }
                </>
            </div>
            {showPostModal && (
                <ModalTicket
                    content={detail}
                    close={() => { setShowModalPost(!showPostModal) }}
                />
            )}
        </div>
    );
}