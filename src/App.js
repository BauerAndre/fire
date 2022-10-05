import { useState, useEffect } from "react";
// import firebase from "./firebaseConnection";
import {
  doc,
  setDoc,
  collection,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
import { db, auth } from "./firebaseConnection";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import "./style.css";
import { async } from "@firebase/util";

function App() {
  const [titulo, setTitulo] = useState("");
  const [autor, setAutor] = useState("");
  const [idPost, setIdPost] = useState("");

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const [user, setUser] = useState(false);
  const [userDetail, setUserDetail] = useState({});

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function loadPosts() {
      const unsub = onSnapshot(collection(db, "posts"), (snapshot) => {
        let listaPost = [];
        snapshot.forEach((doc) => {
          listaPost.push({
            id: doc.id,
            titulo: doc.data().titulo,
            autor: doc.data().autor,
          });
        });
        setPosts(listaPost);
      });
    }
    loadPosts();
  }, []);

  useEffect(() => {
    async function checkLogin() {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          //se tem user logado ele entra aqui...
          console.log(user);
          setUser(true);
          setUserDetail({ uid: user.uid, email: user.email });
        } else {
          // nao possui nenhum user logado.
          setUser(false);
          setUserDetail({});
        }
      });
    }
    checkLogin();
  }, []);

  async function handleAdd() {
    // await firebase
    //   .firestore()
    //   .collection("posts")
    //   .doc("12345")
    //   .set({
    //     titulo: titulo,
    //     autor: autor,
    //   })
    //   .then(() => {
    //     console.log("dados cadastrados com sucesso");
    //   })
    //   .catch((error) => {
    //     console.log("Gerou algum erro: " + error());
    //   });

    await addDoc(collection(db, "posts"), {
      titulo: titulo,
      autor: autor,
    })
      .then(() => {
        console.log("CADASTRADO COM SUCESSO");
        setAutor("");
        setTitulo("");
      })
      .catch((error) => {
        console.log("ERRO" + error);
      });
  }

  async function buscarPost() {
    // const postRef = doc(db, "posts", "12345");

    // await getDoc(postRef)
    //   .then((snapshot) => {
    //     setAutor(snapshot.data().autor);
    //     setTitulo(snapshot.data().titulo);
    //   })
    //   .catch(() => {
    //     console.log("ERRO AO BUSCAR");
    //   });

    const postRef = collection(db, "posts");
    await getDocs(postRef)
      .then((snapshot) => {
        let lista = [];
        snapshot.forEach((doc) => {
          lista.push({
            id: doc.id,
            titulo: doc.data().titulo,
            autor: doc.data().autor,
          });
        });
        setPosts(lista);
      })
      .catch((error) => {
        console.log("DEU ERRO AO BUSCAR");
      });
  }

  async function editarPost() {
    const docRef = doc(db, "posts", idPost);
    await updateDoc(docRef, {
      titulo: titulo,
      autor: autor,
    })
      .then(() => {
        console.log("POST ATUALIZADO!");
        setIdPost("");
        setTitulo("");
        setAutor("");
      })
      .catch(() => {
        console.log("ERRO AO ATUALIZAR O POST");
      });
  }

  async function excluirPost(id) {
    const docRef = doc(db, "posts", id);
    await deleteDoc(docRef).then(() => {
      alert("Post deletado com sucesso");
    });
  }

  async function novoUsuario() {
    await createUserWithEmailAndPassword(auth, email, senha)
      .then((value) => {
        console.log("CADSATRADO COM SUCESSO!");
        setEmail("");
        setSenha("");
      })
      .catch((error) => {
        if (error.code === "auth/weak-password") {
          alert("Senha muito fraca.");
        } else if (error.code === "auth/email-already-in-use") {
          alert("Email ja existe!");
        }
        console.log("ERROR AO CADASTRAR");
      });
  }

  async function logarUsuario() {
    await signInWithEmailAndPassword(auth, email, senha)
      .then((value) => {
        console.log("USER LOGADO COM SUCESSO");
        console.log(value.user);

        setUserDetail({
          uid: value.user.uid,
          email: value.user.email,
        });
        setUser(true);

        setEmail("");
        setSenha("");
      })
      .catch(() => {
        console.log("ERRO AO FAZER O LOGIN");
      });
  }

  async function fazerLogout() {
    await signOut(auth);
    setUser(false);
    setUserDetail({});
  }

  return (
    <div>
      <h1>ReactJS + Firebase :)</h1>

      {user && (
        <div>
          <strong>Seja bem-vindo(a) Voce esta logado!</strong>
          <br />
          <span>
            ID: {userDetail.uid} - Email: {userDetail.email}
          </span>
          <br />
          <button onClick={fazerLogout}>Sair da conta</button>
          <br />
          <br />
        </div>
      )}

      <div className="container">
        <h2>Usuarios</h2>
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Digite seu email"
        />
        <label>Senha</label>
        <input
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          placeholder="Digite sua senha"
          type="password"
        />{" "}
        <br />
        <button onClick={novoUsuario}>Cadastrar</button>
        <button onClick={logarUsuario}>Fazer login</button>
      </div>
      <br />
      <br />
      <hr />
      <div className="container">
        <h2>POSTS</h2>
        <label>ID do Post:</label>
        <input
          type="text"
          value={idPost}
          placeholder="Digite o ID do post"
          onChange={(e) => setIdPost(e.target.value)}
        />
        <br />

        <label>Titulo:</label>
        <textarea
          type="text"
          placeholder="Digite o titulo"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />

        <label>Autor:</label>
        <input
          type="text"
          placeholder="Autor do post"
          value={autor}
          onChange={(e) => setAutor(e.target.value)}
        />

        <button onClick={handleAdd}>Cadastrar</button>
        <button onClick={buscarPost}>Buscar post</button>
        <br />
        <button onClick={editarPost}>Atualizar post</button>
        <ul>
          {posts.map((post) => {
            return (
              <li key={post.id}>
                <strong>ID: {post.id}</strong>
                <br />
                <span>Titulo: {post.titulo}</span>
                <br />
                <span>Autor: {post.autor}</span>
                <br />
                <button onClick={() => excluirPost(post.id)}>
                  Excluir
                </button>{" "}
                <br /> <br />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default App;
