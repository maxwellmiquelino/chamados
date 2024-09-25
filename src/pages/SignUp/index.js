import './signup.css';
import logo from '../../assets/logo.png';
import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/auth';

export default function SignUp(){
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { signUp, loadingAuth } = useContext(AuthContext);

    async function handleSubmit(e){
        e.preventDefault();

        if(name !== '' && email !== '' && password !== ''){
            await signUp(name, email, password);
        }
    }


    return (
        <div className='container-center'>
            <div className='login'>
                <div className='login-area'>
                    <img src={logo} alt='Logo do Sistema de Chamados' />
                </div>

                <form onSubmit={handleSubmit}>
                    <h1>CADASTRAR NOVA CONTA</h1>
                    <input
                        type='text'
                        placeholder='Digite seu Nome.'
                        value={name}
                        onChange={(e) => { setName(e.target.value); }} 
                        required="true"
                    />
                    <input
                        type='text'
                        placeholder='Digite seu email.'
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); }} 
                        required="true"
                    />
                    <input
                        type='password'
                        placeholder='Digite sua senha.'
                        value={password}
                        onChange={(e) => { setPassword(e.target.value); }} 
                        required="true"
                    />

                    <button type='submit'>
                        {loadingAuth ? 'CARREGANDO ...' : 'CADASTRAR'}
                    </button>
                </form>
                <Link to="/">Já possui uma conta? Faça Login</Link>
            </div>
        </div>
    );
}