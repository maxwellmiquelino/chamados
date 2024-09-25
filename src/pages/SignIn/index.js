import './signin.css';
import logo from '../../assets/logo.png';
import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/auth';

export default function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { signIn, loadingAuth } = useContext(AuthContext);

    async function handleSignIn(e){
        e.preventDefault(); // Prever comportamento padrão
        
        if(email !== '' && password !== ''){
            await signIn(email, password);
        }
    }

    return (
        <div className='container-center'>
            <div className='login'>
                <div className='login-area'>
                    <img src={logo} alt='Logo do Sistema de Chamados' />
                </div>

                <form onSubmit={handleSignIn}>
                    <h1>ENTRAR</h1>
                    <input
                        type='text'
                        placeholder='Digite seu email.'
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); }} 
                    />
                    <input
                        type='password'
                        placeholder='Digite sua senha.'
                        value={password}
                        onChange={(e) => { setPassword(e.target.value); }} 
                    />

                    <button type='submit'>
                        {loadingAuth ? 'CARREGANDO ...' : 'ENTRAR'}
                    </button>
                </form>
                <Link to="/register">Criar uma conta!</Link>
            </div>
        </div>
    );
}