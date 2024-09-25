import avatarImg from '../../assets/avatar.png';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../contexts/auth';
import { FiHome, FiUser, FiSettings } from 'react-icons/fi';
import '../Header/header.css';

export default function Header() {
    const { user } = useContext(AuthContext)
    return (
        <div className="sidebar">
            <div>
                <img src={user.avatarUrl === null ? avatarImg : user.avatarUrl} alt="Foto do Perfil Usuário"></img>
            </div>
            <Link to="/dashboard">
                <FiHome color='#FFF' size={24} />
                <span>DASHBOARD</span>
            </Link>
            <Link to="/customers">
                <FiUser color='#FFF' size={24} />
                <span>CLIENTES</span>
            </Link>
            <Link to="/profile">
                <FiSettings color='#FFF' size={24} />
                <span>PERFIL</span>
            </Link>
        </div>
    );
}