import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../contexts/auth';
import Header from '../../components/Header';
import Title from '../../components/Title';
import { FiUser } from 'react-icons/fi';
import axios from 'axios';
import { mobileNumberFormated, phoneNumberFormated, cepFormated, cpfFormated, cnpjFormated } from '../../services/api';
import { db } from '../../services/firebaseConnection';
import { collection, getDocs, getDoc, doc, addDoc, updateDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { useParams, useNavigate } from "react-router-dom";

//const listRef = collection(db, "customers");

export default function Costumers() {
    const { user } = useContext(AuthContext);
    const [customerSelected, setCustomerSelected] = useState(false);
    const [numeroCelular, setNumeroCelular] = useState('');
    const [numeroFixo, setNumeroFixo] = useState('');
    const [razaoNome, setRazaoNome] = useState('');
    const [fantasiaNomeSocial, setFantasiaNomeSocial] = useState('');
    const [cnpjCpf, setCnpjCpf] = useState('');
    const [cep, setCEP] = useState('');
    const [logradouro, setLogradouro] = useState('');
    const [numero, setNumero] = useState('');
    const [complemento, setComplemento] = useState('');
    const [bairro, setBairro] = useState('');
    const [cidade, setCidade] = useState('');
    const [uf, setUF] = useState('');
    const [email, setEmail] = useState('');
    const [obs, setObs] = useState('');
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            loadId();
        }
    }, [id]);

    function handleClear(e) {
        e.preventDefault();
        setNumeroCelular('');
        setNumeroFixo('');
        setRazaoNome('');
        setFantasiaNomeSocial('');
        setCnpjCpf('');
        setCEP('');
        setLogradouro('');
        setNumero('');
        setComplemento('');
        setBairro('');
        setCidade('');
        setUF('');
        setEmail('');
        setObs('');
    }

    async function loadId() {
        const docRef = doc(db, "customers", id);
        await getDoc(docRef)
            .then((snapshot) => {
                setNumeroCelular(snapshot.data().numeroCelular);
                setNumeroFixo(snapshot.data().numeroFixo);
                setRazaoNome(snapshot.data().razaoNome);
                setFantasiaNomeSocial(snapshot.data().fantasiaNomeSocial);
                setCnpjCpf(snapshot.data().cnpjCpf);
                setCEP(snapshot.data().cep);
                setLogradouro(snapshot.data().logradouro);
                setNumero(snapshot.data().numero);
                setComplemento(snapshot.data().complemento);
                setBairro(snapshot.data().bairro);
                setCidade(snapshot.data().cidade);
                setUF(snapshot.data().uf);
                setEmail(snapshot.data().email);
                setObs(snapshot.data().obs);

                //let index = list.findIndex(item => item.id === snapshot.data().customerId);
                //setCustomerSelected(index);
            })
            .catch((error) => {
                console.log(error);
                toast.error("Ops! Algo deu errado !!!");
            });
    }

    async function handleRegisterCostumer(e) {
        e.preventDefault();
        if (id) {
            const docRef = doc(db, "customers", id);
            await updateDoc(docRef, {
                numeroCelular: numeroCelular,
                numeroFixo: numeroFixo,
                razaoNome: razaoNome,
                fantasiaNomeSocial: fantasiaNomeSocial,
                cnpjCpf: cnpjCpf,
                cep: cep,
                logradouro: logradouro,
                numero: numero,
                complemento: complemento,
                bairro: bairro,
                cidade: cidade,
                uf: uf,
                email: email,
                obs: obs,
                userId: user.uid
            })
                .then(() => {
                    toast.success("Ticket atualizado com sucesso !!!");
                    setComplemento('');
                    setCustomerSelected(0);
                    navigate("/newcustomers");
                })
                .catch((error) => {
                    console.log(error);
                    toast.error("Ops! Algo deu errado !!!");
                });
        } else {
            await addDoc(collection(db, "customers"), {
                numeroCelular: numeroCelular,
                numeroFixo: numeroFixo,
                razaoNome: razaoNome,
                fantasiaNomeSocial: fantasiaNomeSocial,
                cnpjCpf: cnpjCpf,
                cep: cep,
                logradouro: logradouro,
                numero: numero,
                complemento: complemento,
                bairro: bairro,
                cidade: cidade,
                uf: uf,
                email: email,
                obs: obs
            }).then(() => {
                handleClear(e);
                toast.success("Dados registrado com sucesso!!!");
            }).catch((error) => {
                console.log(error);
                toast.error("Ops!!! Algo de errado!!!");
            });
        }
    }

    async function getCEP(e) {
        e.preventDefault();
        if(cep.length === 0) return;

        const url = `https://viacep.com.br/ws/${cep}/json/`;
        //console.log(url);
        await axios.get(url, {
            validateStatus: function (status) {
                // Resolve apenas se o status estiver no intervalo 2xx
                return status >= 200 && status < 300;
            }
        })
            .then(response => {
                //console.log(response.data); // Manipule a resposta corretamente
                setLogradouro(response.data.logradouro);
                setBairro(response.data.bairro);
                setUF(response.data.estado);
                setCidade(response.data.localidade);

            })
            .catch(error => {
                console.error('Erro na requisição:', error);
            });
    }

    return (
        <div>
            <Header />
            <div className='content'>
                <Title name="Clientes">
                    <FiUser size={25} />
                </Title>
                <div className='container'>
                    <form className='form-profile' onSubmit={handleRegisterCostumer}>
                        <label>Número do Celular / WhatsApp</label>
                        <input
                            type="text"
                            value={numeroCelular}
                            placeholder='(00) 0 0000-0000'
                            onChange={
                                (e) => {
                                    let value = e.target.value;
                                    setNumeroCelular(e.target.value);
                                    if (value.length == 11) {
                                        let formated = mobileNumberFormated(e.target.value);
                                        setNumeroCelular(formated);
                                    }
                                }
                            }
                        />
                        <label>Número do Telefone</label>
                        <input
                            type="text"
                            value={numeroFixo}
                            placeholder='(00) 0000-0000'
                            onChange={
                                (e) => {
                                    let value = e.target.value;
                                    setNumeroFixo(e.target.value);
                                    if (value.length == 10) {
                                        let formated = phoneNumberFormated(e.target.value);
                                        setNumeroFixo(formated);
                                    }
                                }
                            }
                        />
                        <label>Razão Social / Nome</label>
                        <input
                            type="text"
                            value={razaoNome}
                            placeholder='Razão Social ou Nome Completo'
                            onChange={(e) => { setRazaoNome(e.target.value); }}
                            required="true"
                        />
                        <label>Fantasia / Nome Social</label>
                        <input
                            type="text"
                            value={fantasiaNomeSocial}
                            placeholder='Fantasia ou Nome Social'
                            onChange={(e) => { setFantasiaNomeSocial(e.target.value); }}
                        />
                        <label>CNPJ / CPF</label>
                        <input
                            type="text"
                            value={cnpjCpf}
                            placeholder='CNPJ: 00.000.000/0000-00 ou CPF: 000.000.000-00'
                            onChange={
                                (e) => {
                                    let value = e.target.value; // <-- cpf / cnpj não formatado
                                    setCnpjCpf(value);
                                    if (value.length == 14) {
                                        let formated = cnpjFormated(e.target.value);
                                        setCnpjCpf(formated);
                                    } else if (value.length == 11) {
                                        let formated = cpfFormated(e.target.value);
                                        setCnpjCpf(formated);
                                    }
                                }
                            }
                            required="true"
                        />
                        <label>CEP</label>
                        <input
                            type="text"
                            value={cep}
                            placeholder='00000-000'
                            onChange={
                                (e) => {
                                    let value = e.target.value;
                                    setCEP(e.target.value);
                                    if (value.length == 8) {
                                        let formated = cepFormated(value);
                                        setCEP(formated);
                                    }
                                }
                            }
                        />
                        <button onClick={getCEP}>PESQUISAR CEP</button><br /><br />
                        <label>Logradouro</label>
                        <input
                            type="text"
                            value={logradouro}
                            placeholder='Endereço'
                            onChange={(e) => { setLogradouro(e.target.value); }}
                        />
                        <label>Número</label>
                        <input
                            type="text"
                            value={numero}
                            placeholder='Número'
                            onChange={(e) => { setNumero(e.target.value); }}
                        />
                        <label>Completo</label>
                        <input
                            type="text"
                            value={complemento}
                            placeholder='Complemento'
                            onChange={(e) => { setComplemento(e.target.value); }}
                        />
                        <label>Bairro</label>
                        <input
                            type="text"
                            value={bairro}
                            placeholder='Bairro'
                            onChange={(e) => { setBairro(e.target.value); }}
                        />
                        <label>Cidade</label>
                        <input
                            type="text"
                            value={cidade}
                            placeholder='Cidade'
                            onChange={(e) => { setCidade(e.target.value); }}
                        />
                        <label>Estado</label>
                        <input
                            type="text"
                            value={uf}
                            placeholder='UF'
                            onChange={(e) => { setUF(e.target.value); }}
                        />
                        <label>E-mail</label>
                        <input
                            type="text"
                            value={email}
                            placeholder='seunome@provedor.com.br'
                            onChange={(e) => { setEmail(e.target.value); }}
                        />
                        <label>Observação</label>
                        <textarea
                            type="text"
                            rows={5}
                            value={obs}
                            onChange={(e) => { setObs(e.target.value); }}
                        />
                        <button type="submit">SALVAR</button><br />
                        <button onClick={handleClear}>LIMPAR</button>
                    </form>
                </div>
            </div>
        </div>
    );
}