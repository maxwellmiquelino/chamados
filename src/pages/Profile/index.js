import Header from '../../components/Header';
import Title from '../../components/Title';
import { FiSettings, FiUpload } from 'react-icons/fi';
import avatar from '../../assets/avatar.png';
import { AuthContext } from '../../contexts/auth';
import { useContext, useState } from 'react';
import { toast } from "react-toastify";
import { doc, updateDoc } from 'firebase/firestore';
import { db, storage } from '../../services/firebaseConnection';
import { ref, getDownloadURL, uploadBytes } from 'firebase/storage';
import './profile.css';

export default function Profile() {
    const { user, storageUser, setUser, logout } = useContext(AuthContext);
    const [avatarUrl, setAvatarUrl] = useState(user && user.avatarUrl);
    const [imageAvatar, setImageAvatar] = useState(null);
    const [name, setName] = useState(user && user.nome);
    const [email, setEmail] = useState(user && user.email);


    async function handleUpdate() {
        const docRef = doc(db, "users", user.uid);
        await updateDoc(docRef, {
            nome: name,
        })
            .then(() => {
                let data = {
                    ...user,
                    nome: name,
                }

                setUser(data);
                storageUser(data);
                toast.success("Dados atualizado com sucesso !!!");
            });
    }
    async function handleUpload(e) {
        const currentUid = user.uid;
        const uploadRef = ref(storage, `images/${currentUid}/${imageAvatar.name}`);
        const uploadTask = uploadBytes(uploadRef, imageAvatar)
            .then((snapshot) => {
                getDownloadURL(snapshot.ref).then(async (downloadURL) => {
                    
                        let urlFoto = downloadURL;
                        const docRef = doc(db, "users", user.uid);
                        await updateDoc(docRef, {
                            avatarUrl: urlFoto,
                            nome: name
                        }).then(() => {
                            let data = {
                                ...user,
                                nome: name,
                                avatarUrl: urlFoto
                            }

                            setUser(data);
                            storageUser(data);
                            toast.success("Dados atualizado com sucesso !!!");
                        });
                    });
            });
    }

    async function handleSubmit(e) {
        e.preventDefault(); // Não atualizar a página

        if (imageAvatar === null && name !== '') {
            //Atualizar o nome
            handleUpdate();
        } else if (name !== '' && imageAvatar !== null) {
            handleUpload();
        }
    }

    function handleFile(e) {
        if (e.target.files[0]) {
            const image = e.target.files[0];
            console.log(image.type);

            if (image.type === 'image/jpge' ||
                image.type === 'image/png') {
                setImageAvatar(image);
                setAvatarUrl(URL.createObjectURL(image));
            } else {
                toast.error("Envie uma imagem do tipo PNG ou JPEG!!!");
                setImageAvatar(null);
                return;
            }
        }
    }

    return (
        <div>
            <Header />
            <div className='content'>
                <Title name="Meu Perfil">
                    <FiSettings size={25} />
                </Title>

                <div className='container'>
                    <form className='form-profile' onSubmit={handleSubmit}>
                        <label className='label-avatar'>
                            <span>
                                <FiUpload color='#FFF' size={25} />
                            </span>
                            <input
                                type='file'
                                accept='image/*'
                                onChange={handleFile}
                            /><br />
                            <img src={avatarUrl === null ? avatar : avatarUrl}
                                alt="Foto do Perfil"
                                width={250}
                                height={250}
                            />
                        </label>
                        <label>Nome</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => { setName(e.target.value); }}
                        />
                        <label>E-mail</label>
                        <input type="text" value={email} disabled={true} />
                        <button type="submit">SALVAR</button>
                    </form>
                </div>
                <div className='container'>
                    <button className='logout-btn' onClick={() => logout()}>SAIR</button>
                </div>
            </div>
        </div>
    );
}