import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate, Navigate } from "react-router-dom";
import LandingPage from "./Pages/LandingPage";
import TodoList from "./Pages/TodoList";
import Login from "./Pages/Login";
import TodoForm from "./Pages/TodoForm";
import Cadastro from "./Pages/Cadastro";
import ForgotPassword from "./Pages/ForgotPassword";
import ResetPassword from "./Pages/ResetPassword";
import logoTodo from "./assets/logo-todo.png";
import { logout, getProfile } from "./API/Todo.jsx";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [usuarioLogado, setUsuarioLogado] = useState(null); 
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const checkUserSession = async () => {
    try {
      const response = await getProfile();
      if (response.status === 200) {
        setIsAuthenticated(true);
        setUsuarioLogado(response.data.usuario || response.data); 
      }
    } catch (error) {
      console.log("Sessão não encontrada ou expirada:", error);
      setIsAuthenticated(false);
      setUsuarioLogado(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkUserSession();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    } finally {
      setIsAuthenticated(false);
      setUsuarioLogado(null);
      navigate("/");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500 font-medium">Carregando...</p>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          isAuthenticated ? <Navigate to="/todos" replace /> : <LandingPage />
        }
      />
      <Route
        path="/*"
        element={
          <div className="min-h-screen bg-gray-50 p-6">
            <header className="max-w-3xl mx-auto mb-8">
              <nav className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">
                  <Link to={isAuthenticated ? "/todos" : "/"}>
                    <img src={logoTodo} alt="Logo ToDo" className="h-20 w-auto" />
                  </Link>
                </h1>

                <div className="flex items-center gap-4">
                  {isAuthenticated && (
                    <>
                      <Link
                        to="/todos"
                        className="text-sm font-medium text-gray-600 hover:text-gray-900"
                      >
                        Tarefas
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors cursor-pointer"
                      >
                        Sair
                      </button>
                    </>
                  )}
                </div>
              </nav>
            </header>

            <main className="max-w-3xl mx-auto">
              <Routes>
                <Route
                  path="todos"
                  element={
                    isAuthenticated ? (
                      <TodoList usuarioLogado={usuarioLogado} /> 
                    ) : (
                      <Navigate to="/login" replace />
                    )
                  }
                />
                <Route
                  path="new"
                  element={
                    isAuthenticated ? <TodoForm /> : <Navigate to="/login" replace />
                  }
                />
                <Route
                  path="login"
                  element={
                    isAuthenticated ? (
                      <Navigate to="/todos" replace />
                    ) : (
                      <Login
                        onLoginSuccess={async () => {
                          await checkUserSession(); // recarrega a sessão antes de navegar
                          navigate("/todos");
                        }}
                      />
                    )
                  }
                />
                <Route
                  path="register"
                  element={
                    isAuthenticated ? <Navigate to="/todos" replace /> : <Cadastro />
                  }
                />
                <Route
                  path="forgot"
                  element={
                    isAuthenticated ? <Navigate to="/todos" replace /> : <ForgotPassword />
                  }
                />
                <Route path="reset-password" element={<ResetPassword />} />
              </Routes>
            </main>
          </div>
        }
      />
    </Routes>
  );
}