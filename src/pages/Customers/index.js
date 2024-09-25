import { AuthContext } from "../../contexts/auth";
import { useEffect, useState, useContext } from "react";
import Header from "../../components/Header";
import Title from '../../components/Title';
import { Link } from "react-router-dom";
import { FiPlus, FiSearch, FiUser, FiEdit2 } from "react-icons/fi";
import { db } from "../../services/firebaseConnection";
import { collection, getDocs, orderBy, limit, startAfter, query } from "firebase/firestore";

const listRef = collection(db, "customers");

export default function Costumers() {
    const { user } = useContext(AuthContext);
    const [customerId, setCustomerId] = useState(false);
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEmpty, setIsEmpty] = useState(false);
    const [lastDocs, setLastDocs] = useState();
    const [loadingMore, setLoadingMore] = useState(false);
    //const navigate = useNavigate();

    useEffect(() => {
        async function loadCustomers() {
            const q = query(listRef, orderBy("razaoNome"), limit(10));

            const querySnapshot = await getDocs(q);
            setCustomers([]);
            await updateState(querySnapshot);
            setLoading(false);
        }

        loadCustomers();

        return () => { }
    }, []);

    async function updateState(querySnapshot) {
        const isCollectionEmpty = querySnapshot.size === 0;

        if (!isCollectionEmpty) {
            let list = [];
            querySnapshot.forEach((doc) => {
                list.push({
                    id: doc.id,
                    razaoNome: doc.data().razaoNome,
                    fantasiaNomeSocial: doc.data().fantasiaNomeSocial,
                    cnpjCpf: doc.data().cnpjCpf,
                    logradouro: doc.data().logradouro,
                    numero: doc.data().numero,
                    complemento: doc.data().complemento,
                    bairro: doc.data().bairro,
                    cep: doc.data().cep,
                    cidade: doc.data().cidade,
                    uf: doc.data().uf,
                    numeroCelular: doc.data().numeroCelular,
                    numeroFixo: doc.data().numeroFixo,
                    email: doc.data().email,
                    obs: doc.data().obs
                });
            });

            // Pegar o último item da lista de tickets
            const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];

            setCustomers(customers => [...customers, ...list]);
            setLastDocs(lastDoc);
        } else {
            setIsEmpty(true);
        }

        setLoadingMore(false);
    }

    return (
        <div>
            <Header />
            <div className='content'>
                <Title name="Clientes">
                    <FiUser size={25} />
                </Title>

                <>
                    {
                        customers.length === 0 ? (
                            <Link to="/newcustomers" className="new-ticket">
                                <FiPlus color="#FFF" size={25} />
                                NOVO CLIENTE
                            </Link>
                        ) : (
                            <>
                                <Link to="/newcustomers" className="new-ticket">
                                    <FiPlus color="#FFF" size={25} />
                                    NOVO CLIENTE
                                </Link>
                                <table>
                                    <thead>
                                        <tr>
                                            <th scope="col">CNPJ / CPF</th>
                                            <th scope="col">RAZÃO / NOME</th>

                                            <th scope="col"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            customers.map((item, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td data-label="CnpjCpf">{item.cnpjCpf}</td>
                                                        <td data-label="RazaoNome">{item.razaoNome}</td>

                                                        <td data-label="#">
                                                            <button className="action-btn" style={{ backgroundColor: '#3583F6' }}>
                                                                <FiSearch color="#FFF" size={18} />
                                                            </button>
                                                            <Link to={`/newcustomers/${item.id}`} className="action-btn" style={{ backgroundColor: '#F6A935' }}>
                                                                <FiEdit2 color="#FFF" size={18} />
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        }
                                    </tbody>
                                </table>
                            </>
                        )
                    }
                </>
            </div>
        </div>
    );
}