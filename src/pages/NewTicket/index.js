import { useState, useEffect, useContext } from 'react';
import Header from '../../components/Header';
import Title from '../../components/Title';
import { FiPlusCircle } from 'react-icons/fi';
import { AuthContext } from '../../contexts/auth';
import { db } from '../../services/firebaseConnection';
import { collection, getDocs, getDoc, doc, addDoc, updateDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { useParams, useNavigate } from "react-router-dom";
import '../NewTicket/newticket.css';

const listRef = collection(db, "customers");

export default function NewTicket() {
    const { user } = useContext(AuthContext);
    const { id } = useParams();
    const [customerId, setCustomerId] = useState(false);
    const [customers, setCustomers] = useState([]);
    const [customerSelected, setCustomerSelected] = useState(0);
    const [loadCostumer, setLoadCustumer] = useState(true);
    const [assunto, setAssunto] = useState("Duvidas");
    const [status, setStatus] = useState("Aberto");
    const [complemento, setComplemento] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        async function loadCostumers() {
            const querySnapshot = await getDocs(listRef)
                .then((snapshot) => {
                    let list = [];
                    snapshot.forEach((doc) => {
                        list.push({
                            id: doc.id,
                            razaoNome: doc.data().razaoNome
                        });
                    });
                    if (snapshot.docs.size === 0) {
                        toast.info("Nenhum cliente cadastrado!!!");
                        setLoadCustumer(false);
                        setCustomers([{ id: "1", nomeFantasia: "Freela" }]);
                        return;
                    }
                    setCustomers(list);
                    setLoadCustumer(false);

                    if (id) {
                        loadId(list);
                    }
                })
                .catch((error) => {
                    console.log(error);
                    toast.error("Ops!!! Aconteceu algo de errado!");
                    setLoadCustumer(false);
                    setCustomers([{ id: "1", nomeFantasia: "Freela" }]);
                })
        }

        loadCostumers();
    }, [id]);

    async function loadId(list) {
        const docRef = doc(db, "tickets", id);
        await getDoc(docRef)
            .then((snapshot) => {
                setAssunto(snapshot.data().subject);
                setComplemento(snapshot.data().complement);
                setStatus(snapshot.data().status);

                let index = list.findIndex(item => item.id === snapshot.data().customerId);
                setCustomerSelected(index);
                setCustomerId(true);
            })
            .catch((error) => {
                console.log(error);
                toast.error("Ops! Algo deu errado !!!");
                setCustomerId(false);
            });
    }

    async function handleRegisterTicket(e) {
        e.preventDefault();

        // Atualizar Ticket
        if (customerId) {
            const docRef = doc(db, "tickets", id);
            await updateDoc(docRef, {
                customerId: customers[customerSelected].id,
                customerName: customers[customerSelected].razaoNome,
                subject: assunto,
                status: status,
                complement: complemento,
                finished: status === "Finalizado" && (new Date()),
                userId: user.uid
            })
                .then(() => {
                    toast.success("Ticket atualizado com sucesso !!!");
                    setComplemento('');
                    setCustomerSelected(0);
                    navigate("/dashboard");
                })
                .catch((error) => {
                    console.log(error);
                    toast.error("Ops! Algo deu errado !!!");
                });
        } else {
            await addDoc(collection(db, "tickets"), {
                created: new Date(),
                finished: "",
                customerId: customers[customerSelected].id,
                customerName: customers[customerSelected].razaoNome,
                subject: assunto,
                status: status,
                complement: complemento,
                userId: user.uid
            })
                .then(() => {
                    toast.success("Ticket incluido com sucesso !!!");
                    setComplemento('');
                    setCustomerSelected(0);
                    navigate("/dashboard");
                })
                .catch((error) => {
                    console.log(error);
                    toast.error("Ops! Algo deu errado !!!");
                });
        }

    }

    function handleChangeCustomer(e) {
        setCustomerSelected(e.target.value);
    }

    function handleChangeSelect(e) {
        setAssunto(e.target.value);
    }

    function handleOptionChange(e) {
        setStatus(e.target.value);
    }

    return (
        <div>
            <Header />
            <div className="content">
                <Title name={id ? `Ticket: ${id}` : "Novo Ticket"}>
                    <FiPlusCircle size={25} />
                </Title>

                <div className="container">
                    <form className="form-profile" onSubmit={handleRegisterTicket}>
                        <label>Clientes</label>
                        {
                            loadCostumer ? (
                                <input type="text" disabled={true} value="Carregando ..." />
                            ) : (
                                <select
                                    required="true"
                                    value={customerSelected}
                                    onChange={handleChangeCustomer} >
                                    {
                                        customers.map((item, index) => {
                                            return (
                                                <option key={index} value={index}>
                                                    {item.razaoNome}
                                                </option>
                                            );
                                        })
                                    }
                                </select>
                            )
                        }

                        <label>Assunto</label>
                        <select
                            required="true"
                            value={assunto}
                            onChange={handleChangeSelect}>
                            <option value="Cancelamento">Cancelamento</option>
                            <option value="Comercial">Comercial</option>
                            <option value="Desenvolvimento">Desenvolvimento</option>
                            <option value="Duvidas">Dúvidas</option>
                            <option value="Erro">Erro</option>
                            <option value="Financeiro">Financeiro</option>
                            <option value="Licenca">Licença</option>
                            <option value="Prospect">Prospect</option>
                            <option value="Suporte">Suporte</option>
                            <option value="Treinamento">Treinamento</option>
                            <option value="Visita Tecnica">Visita Técnica</option>
                        </select>
                        <label>Status</label>
                        <div className="status">
                            <input
                                type="radio"
                                name="radio"
                                value="Aberto"
                                onChange={handleOptionChange}
                                checked={status === "Aberto"}
                            />
                            <span>Aberto</span>

                            <input
                                type="radio"
                                name="radio"
                                value="Andamento"
                                onChange={handleOptionChange}
                                checked={status === "Andamento"}
                            />
                            <span>Em Andamento</span>

                            <input
                                type="radio"
                                name="radio"
                                value="Finalizado"
                                onChange={handleOptionChange}
                                checked={status === "Finalizado"}
                            />
                            <span>Finalizado</span>
                        </div>

                        <label>Complemento</label>
                        <textarea
                            type="text"
                            placeholder="Descrição do acontecimento"
                            value={complemento}
                            onChange={(e) => { setComplemento(e.target.value) }}
                        />
                        <button type="submit">REGISTRAR</button>
                    </form>
                </div>
            </div>
        </div>
    );
}