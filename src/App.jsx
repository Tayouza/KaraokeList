import './App.css';
import {
    BsTrash,
    BsArchiveFill,
    BsBookmarkCheck,
    BsBookmarkCheckFill,
    BsArrowUpShort
} from 'react-icons/bs';
import { useState, useEffect } from 'react';
import AnimLoading from './components/AnimLoading';
import md5 from 'md5';

const API = "https://karaokelistdb.up.railway.app"

function App() {
    const [musics, setMusics] = useState([]),
        [deletedMusics, setdeletedMusics] = useState([]),
        [person, setPerson] = useState(""),
        [nameMusic, setNameMusic] = useState(""),
        [artist, setArtist] = useState(""),
        [showDel, setShowDel] = useState('hide'),
        [loading, setLoading] = useState(false)

    useEffect(() => {
        const loadData = async () => {

            setLoading(true)

            const resmusics = await fetch(`${API}/music`)
                .then(res => res.json())
                .then(data => data)
                .catch(err => console.log(err))

            const resdeletedMusics = await fetch(`${API}/music-deleted`)
                .then(res => res.json())
                .then(data => data)
                .catch(err => console.log(err))

            setLoading(false)

            setMusics(resmusics)
            setdeletedMusics(resdeletedMusics)
        }

        loadData();

    }, [])

    if (loading) {
        return <AnimLoading />
    }

    const handleAdd = async (e) => {
        e.preventDefault();

        const musics = {
            id: md5(nameMusic + artist + Math.random()),
            person,
            nameMusic,
            artist,
            done: false
        }

        await fetch(`${API}/music`, {
            method: "POST",
            body: JSON.stringify(musics),
            headers: {
                "Content-type": "application/json"
            }
        })

        setMusics((prevState) => [...prevState, musics])

        setPerson('')
        setNameMusic('')
        setArtist('')
    }

    const handleDelete = async (musics) => {

        await fetch(`${API}/music-deleted/${musics.id}`, {
            method: "DELETE"
        })

        setdeletedMusics((prevState) => prevState.filter((item) => item.id !== musics.id))

    }

    const handleMark = async (musics) => {
        musics.done = !musics.done;

        const data = await fetch(`${API}/music/${musics.id}`, {
            method: "PUT",
            body: JSON.stringify(musics),
            headers: {
                "Content-type": "application/json"
            }
        });

        setMusics((prevState) => prevState.map((t) => (!t.id ? (t = data) : t)))

    }

    const handleMoveBetweenMusics = async (musics, tableIn, tableOut, setIn, setOut) => {

        await fetch(`${API}/${tableIn}`, {
            method: "POST",
            body: JSON.stringify(musics),
            headers: {
                "Content-type": "application/json"
            }
        })

        await fetch(`${API}/${tableOut}/${musics.id}`, {
            method: "DELETE"
        })

        setOut((prevState) => prevState.filter((item) => item.id !== musics.id))
        setIn((prevState) => [...prevState, musics])
    }

    const handleShowDelMusics = (showDel) => {

        showDel = showDel === 'hide' ? 'show' : 'hide'

        setShowDel(showDel)

    }

    const ListMusics = () => {

        return (
            <div className='musics'>
                {musics.length === 0 && <p>Nenhuma Música...</p>}
                {musics.map((item) => (
                    <div className='item-list' key={item.id}>
                        <div className="infos">
                            <h4 className={item.done ? "item-done" : ""}> {item.nameMusic}</h4>
                            <p>Quem cantará: {item.person}</p>
                            <p>Artista: {item.artist}</p>
                        </div>
                        <div className='options'>
                            <span onClick={() => handleMark(item)}>
                                {item.done ? <BsBookmarkCheckFill /> : <BsBookmarkCheck />}
                            </span>
                            <span onClick={() => handleMoveBetweenMusics(item, "music-deleted", "music", setdeletedMusics, setMusics)}>
                                <BsArchiveFill />
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        )

    }

    const ShowDeleted = () => {

        return (
            <div className='music-deleted'>
                {deletedMusics.length === 0 && <p>Nenhuma música arquivada...</p>}
                {deletedMusics.map((item) => (
                    <div className="item-list" key={item.id}>
                        <div className="infos">
                            <h4 className={item.done ? "item-done" : ""}> {item.nameMusic}</h4>
                            <p>Artista: {item.artist}</p>
                        </div>
                        <div className="options">
                            <span onClick={() => handleMoveBetweenMusics(item, "music", "music-deleted", setMusics, setdeletedMusics)}>
                                <BsArrowUpShort />
                            </span>
                            <span onClick={() => handleDelete(item)}>
                                <BsTrash />
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        )

    }

    return (
        <div className='App'>
            <div className='title'>
                <h1>Karaoke list</h1>
            </div>
            <div className='insert-music'>
                <h3>Insira sua Música</h3>
                <form onSubmit={handleAdd}>
                    <div>
                        <label htmlFor="title">Qual seu nome?</label>
                        <input
                            type="text"
                            placeholder='Seu nome'
                            name='person'
                            onChange={(e) => { setPerson(e.target.value) }}
                            value={person || ''}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="title">Qual música irá cantar?</label>
                        <input
                            type="text"
                            placeholder='Titulo da música'
                            name='title'
                            onChange={(e) => { setNameMusic(e.target.value) }}
                            value={nameMusic || ''}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="artist">Artista:</label>
                        <input type="text"
                            placeholder='Artista'
                            name='artist'
                            onChange={(e) => { setArtist(e.target.value) }}
                            value={artist || ''}
                            required
                        />
                    </div>
                    <input type="submit" value="Criar música" className='btn' />
                </form>
            </div>
            <div>
                <h3>Lista de músicas</h3>
                <ListMusics />
            </div>
            <div>
                <button onClick={() => { handleShowDelMusics(showDel) }} className='btn'>Músicas arquivadas</button>
                {showDel === 'show' && <ShowDeleted />}
            </div>
        </div>
    );
}

export default App;
