const getState = ({ getStore, getActions, setStore }) => {
  const backendUrl = process.env.BACKEND_URL;

  return {
    store: {
      message: null,
      isLoggedIn: !!localStorage.getItem("token"), // Inicializa com base no token no localStorage
      user: null,
      categories: [],
      subcategories: [],
      serviceCategories: [],
      serviceSubcategories: [],
      products: [],
      services: [],
      searchedProducts: [],
      searchedServices: [],
      userItems: [],
      tradeProposals: [],
      sent_trades: [],
      received_trades: [],
      new_sent_trades: [],
      new_received_trades: [],
      addFavorite: [],
      demo: [
        {
          title: "FIRST",
          background: "white",
          initial: "white",
        },
        {
          title: "SECOND",
          background: "white",
          initial: "white",
        },
      ],
    },
    actions: {
      // Use getActions to call a function within a fuction
      exampleFunction: () => {
        getActions().changeColor(0, "green");
      },

      getMessage: async () => {
        try {
          // fetching data from the backend
          const resp = await fetch(process.env.BACKEND_URL + "/api/hello");
          const data = await resp.json();
          setStore({ message: data.message });
          // don't forget to return something, that is how the async resolves
          return data;
        } catch (error) {
          console.log("Error loading message from backend", error);
        }
      },

      changeColor: (index, color) => {
        //get the store
        const store = getStore();

        //we have to loop the entire demo array to look for the respective index
        //and change its color
        const demo = store.demo.map((elm, i) => {
          if (i === index) elm.background = color;
          return elm;
        });

        //reset the global store
        setStore({ demo: demo });
      },

      registerUser: (email, password) => {
        const backendUrl = process.env.BACKEND_URL;
        return fetch(`${backendUrl}/api/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.access_token) {
              // Armazenar o token de acesso na local storage
              localStorage.setItem("token", data.access_token);
              // Atualizar o estado global para refletir que o usuário está logado
              setStore({ isLoggedIn: true, loggedInUserId: data.user.id });
              return true; // Indica sucesso
            } else if (data.msg) {
              alert(data.msg);
            }
            return false; // Indica falha
          })
          .catch((error) => {
            console.error("Error:", error);
            return false; // Indica falha
          });
      },

      storeToken: (token) => {
        localStorage.setItem("token", token);
      },

      loginUser: async (email, password, navigate, onSuccess) => {
        try {
          const backendUrl = process.env.BACKEND_URL;

          // Fazendo uma chamada de API para autenticar o usuário
          const response = await fetch(`${backendUrl}/api/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });

          if (response.status === 401) {
            getActions().logoutUser();
            navigate("/login");
            return;
        }

          if (response.ok) {
            const data = await response.json();
            // Atualizando o estado global com as informações do usuário logado
            setStore({
              isLoggedIn: true,
              authToken: data.access_token,
              loggedInUserId: data.user.id,
            });
            // Armazenando o token na local storage
            localStorage.setItem("token", data.access_token);

            // Console log para depurar.
            console.log("Logged in user ID:", data.user.id); // or use console.log("Logged in user object:", data.user); to see the whole object

            // Chama a função de callback onSuccess
            if (onSuccess) {
              onSuccess();
            }
            // Redirecionando o usuário para a página de perfil
            navigate("/profile");
          } else {
            // Mostrando um alerta para o usuário
            alert(
              "The user does not exist. Make sure you are inserting correct values."
            );
          }
        } catch (error) {
          // Tratando erros de rede ou outros erros inesperados aqui
          console.error("Ocorreu um erro ao fazer login", error);
        }
      },

      logoutUser: (onLogout) => {
        localStorage.removeItem("token");
        setStore({ isLoggedIn: false });

        // Chama a função de callback onLogout
        if (onLogout) {
          onLogout();
        }
      },

      // define o estado de login
      setLoginState: (loggedIn) => {
        setStore({ isLoggedIn: loggedIn });
      },

      getUserInfo: async function () {
        try {
          const token = localStorage.getItem("token");
          const headers = new Headers({
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          });
          const backendUrl = process.env.BACKEND_URL;
          const apiUrl = `${backendUrl}/api/user/me`;
      
          const response = await fetch(apiUrl, { headers: headers });
          const data = await response.json();
      
          if (response.ok) {
            setStore({
              user: {
                ...data,
                location: data.location,
                latitude: data.latitude,
                longitude: data.longitude, 
                image_url: data.image_url,
              },
            });
          } else {
            console.error("Failed to fetch user info:", data);
          }
        } catch (error) {
          console.error("Error fetching user info:", error);
        }
      },
      
      
      updateUserInfo: async function (userInfo) {
        try {
          const token = localStorage.getItem("token");
          const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          });
          const backendUrl = process.env.BACKEND_URL;
      
          // Enviar uma solicitação PUT para atualizar as informações do usuário
          const response = await fetch(`${backendUrl}/api/user/me`, {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify(userInfo)
          });
      
          // Se a resposta não for ok, lançamos um erro
          if (!response.ok) {
            const data = await response.json();
            
            // Aqui verificamos a mensagem de erro retornada pela resposta
            if (data.msg === 'Username already in use') {
              throw new Error('This username is already in use, please choose another one');
            } else {
              throw new Error('Network response was not ok');
            }
          }
      
          const data = await response.json();
      
          // Aqui podemos mostrar uma mensagem de sucesso.
          console.log('User information updated successfully:', data);
      
          // Atualizar o store com as novas informações do usuário
          setStore({
            user: data,
          });

          return true;
      
        } catch(error) {
      
          // Aqui posso decidir como desejo manipular o erro de username já existente
          if (error.message === 'This username is already in use, please choose another one') {
            alert(error.message);
          }
          return false;
        }
      },
      
      
      getCategories: async function () {
        try {
          const response = await fetch(`${backendUrl}/api/product-categories`);
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();
          setStore({ categories: data });
        } catch (error) {
          console.error("Error fetching categories:", error);
        }
      },

      getSubcategories: async function (categoryId) {
        try {
          const response = await fetch(
            `${backendUrl}/api/product-subcategories?category_id=${categoryId}`
          );
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();
          console.log("Subcategories data:", data);
          setStore({ subcategories: data });
        } catch (error) {
          console.error("Error fetching subcategories:", error);
        }
      },

      getServiceCategories: async function () {
        try {
          const response = await fetch(`${backendUrl}/api/service-categories`);
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();
          setStore({ serviceCategories: data });
        } catch (error) {
          console.error("Error fetching service categories:", error);
        }
      },

      getServiceSubcategories: async function (categoryId) {
        try {
          const response = await fetch(
            `${backendUrl}/api/service-subcategories?category_id=${categoryId}`
          );
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();
          console.log("Service subcategories data:", data);
          setStore({ serviceSubcategories: data });
        } catch (error) {
          console.error("Error fetching service subcategories:", error);
        }
      },

      deleteUserInfo: async function (store) {
        try {
          const token = localStorage.getItem("token");
          const headers = new Headers({
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          });
          const backendUrl = process.env.BACKEND_URL;
          const apiUrl = `${backendUrl}/api/user/me`;
      
          const response = await fetch(apiUrl, {
            method: "DELETE",
            headers: headers,
          });
      
          const textResponse = await response.text();
      
          try {
            const data = JSON.parse(textResponse);
            if (response.ok) {
              console.log("User deleted successfully:", data);
              // Atualiza a store após a exclusão do usuário
              setStore({
                user: null,
                token: null,
              });
              // Limpa o token do localStorage
              localStorage.removeItem("token");
            } else {
              console.log("Error deleting user:", data);
            }
          } catch (error) {
            console.error("Error parsing JSON:", error);
            console.log("Server response:", textResponse);
          }
        } catch (error) {
          console.error("Error deleting user:", error);
        }
      },
      


      deleteProduct: async function (store, productId) {
        try {
          const token = localStorage.getItem("token");
          const headers = new Headers({
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          });
          const backendUrl = process.env.BACKEND_URL;
          const apiUrl = `${backendUrl}/api/products/${productId}`;
    
          const response = await fetch(apiUrl, {
            method: "DELETE",
            headers: headers,
          });
    
          const textResponse = await response.text();
    
          try {
            const data = JSON.parse(textResponse);
            if (response.ok) {
              console.log("Product deleted successfully:", data);
              // Atualiza a store após a exclusão do produto
              const updatedProducts = store.userProducts.filter(product => product.id !== productId);
              setStore({
                userProducts: updatedProducts,
              });
            } else {
              console.log("Error deleting product:", data);
            }
          } catch (error) {
            console.error("Error parsing JSON:", error);
            console.log("Server response:", textResponse);
          }
        } catch (error) {
          console.error("Error deleting product:", error);
        }
      },

    deleteService: async function (store, serviceId) {
        try {
          const token = localStorage.getItem("token");
          const headers = new Headers({
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          });
          const backendUrl = process.env.BACKEND_URL;
          const apiUrl = `${backendUrl}/api/services/${serviceId}`;
    
          const response = await fetch(apiUrl, {
            method: "DELETE",
            headers: headers,
          });
    
          const textResponse = await response.text();
    
          try {
            const data = JSON.parse(textResponse);
            if (response.ok) {
              console.log("Service deleted successfully:", data);
              // Atualiza a store após a exclusão do serviço
              const updatedServices = store.userServices.filter(service => service.id !== serviceId);
              setStore({
                userServices: updatedServices,
              });
            } else {
              console.log("Error deleting service:", data);
            }
          } catch (error) {
            console.error("Error parsing JSON:", error);
            console.log("Server response:", textResponse);
          }
        } catch (error) {
          console.error("Error deleting service:", error);
        }
      },
    

      fetchProducts: async function (categoryId, subcategoryId, location, bounds) {
        try {
          const backendUrl = process.env.BACKEND_URL;
          let apiUrl = `${backendUrl}/api/products`;
      
          if (categoryId || subcategoryId || location || bounds) {
            apiUrl += "?";
            if (categoryId) {
              apiUrl += `category_id=${categoryId}`;
            }
            if (subcategoryId) {
              apiUrl += categoryId
                ? `&subcategory_id=${subcategoryId}`
                : `subcategory_id=${subcategoryId}`;
            }
      
            if (location) {
              apiUrl += categoryId || subcategoryId
                ? `&location=${location.lat},${location.lng}`
                : `location=${location.lat},${location.lng}`;
            }
            if (bounds) {
              apiUrl += categoryId || subcategoryId || location
                ? `&top_left_lat=${bounds.ne.lat}&top_left_long=${bounds.sw.lng}&bottom_right_lat=${bounds.sw.lat}&bottom_right_long=${bounds.ne.lng}`
                : `top_left_lat=${bounds.ne.lat}&top_left_long=${bounds.sw.lng}&bottom_right_lat=${bounds.sw.lat}&bottom_right_long=${bounds.ne.lng}`;
            }
          }
      
          const response = await fetch(apiUrl);
          const data = await response.json();

          console.log(data); // Imprime os dados retornados pela API
      
          if (response.ok) {
            const store = getStore();
            const loggedInUserId = parseInt(store.loggedInUserId, 10);
            const filteredProducts = data.filter(
              (product) => parseInt(product.user_id, 10) !== loggedInUserId
            );
            setStore({ products: filteredProducts });
          } else {
            console.error("Failed to fetch products:", data);
          }
        } catch (error) {
          console.error("Error fetching products:", error);
        }
      },
      
      

      fetchServices: async function (categoryId, subcategoryId, location, bounds) {
        try {
          const backendUrl = process.env.BACKEND_URL;
          let apiUrl = `${backendUrl}/api/services`;
    
          if (categoryId || subcategoryId || location || bounds) {
            apiUrl += "?";
            if (categoryId) {
              apiUrl += `category_id=${categoryId}`;
            }
            if (subcategoryId) {
              apiUrl += categoryId
                ? `&subcategory_id=${subcategoryId}`
                : `subcategory_id=${subcategoryId}`;
            }
    
            if (location) {
              apiUrl += categoryId || subcategoryId
                ? `&location=${location.lat},${location.lng}`
                : `location=${location.lat},${location.lng}`;
            }
            if (bounds) {
              apiUrl += categoryId || subcategoryId || location
                ? `&top_left_lat=${bounds.ne.lat}&top_left_long=${bounds.sw.lng}&bottom_right_lat=${bounds.sw.lat}&bottom_right_long=${bounds.ne.lng}`
                : `top_left_lat=${bounds.ne.lat}&top_left_long=${bounds.sw.lng}&bottom_right_lat=${bounds.sw.lat}&bottom_right_long=${bounds.ne.lng}`;
            }
          }
    
          console.log("API URL:", apiUrl); 
    
          const response = await fetch(apiUrl);
          const data = await response.json();

          console.log(data); // Imprime os dados retornados pela API
    
          if (response.ok) {
            const store = getStore();
            const loggedInUserId = parseInt(store.loggedInUserId, 10);
            const filteredServices = data.filter(
              (service) => parseInt(service.user_id, 10) !== loggedInUserId
            );
            setStore({ services: filteredServices });
          } else {
            console.error("Failed to fetch services:", data);
          }
        } catch (error) {
          console.error("Error fetching services:", error);
        }
    },

    fetchOnlineServices: async function (categoryId, subcategoryId, searchTerm) {
      try {
        const backendUrl = process.env.BACKEND_URL;
        let apiUrl = `${backendUrl}/api/services/online`;
  
        if (categoryId || subcategoryId || searchTerm) {
          apiUrl += "?";
          if (categoryId) {
            apiUrl += `category_id=${categoryId}`;
          }
          if (subcategoryId) {
            apiUrl += categoryId
              ? `&subcategory_id=${subcategoryId}`
              : `subcategory_id=${subcategoryId}`;
          }
  
          if (searchTerm) {
            apiUrl += categoryId || subcategoryId
              ? `&search_term=${searchTerm}`
              : `search_term=${searchTerm}`;
          }
        }
  
        const response = await fetch(apiUrl);
        const data = await response.json();
  
        if (response.ok) {
          const store = getStore();
          const loggedInUserId = parseInt(store.loggedInUserId, 10);
          const filteredServices = data.filter(
            (service) => parseInt(service.user_id, 10) !== loggedInUserId
          );
          setStore({ onlineServices: filteredServices });
        } else {
          console.error("Failed to fetch online services:", data);
        }
      } catch (error) {
        console.error("Error fetching online services:", error);
      }
  },
  
    

    fetchItemsByName: async function (searchTerm, location, bounds) {
      try {
        const backendUrl = process.env.BACKEND_URL;
        let apiUrl = `${backendUrl}/api/items/search?name=${searchTerm}`;
  
        if (location || bounds) {
          if (location) {
            apiUrl += `&location=${location.lat},${location.lng}`;
          }
          if (bounds) {
            apiUrl += `&top_left_lat=${bounds.ne.lat}&top_left_long=${bounds.sw.lng}&bottom_right_lat=${bounds.sw.lat}&bottom_right_long=${bounds.ne.lng}`;
          }
        }
  
        const response = await fetch(apiUrl);
        const data = await response.json();
  
        if (response.ok) {
          const store = getStore();
          const loggedInUserId = parseInt(store.loggedInUserId, 10);
          const filteredProducts = data.products.filter(
            (product) => parseInt(product.user_id, 10) !== loggedInUserId
          );
          const filteredServices = data.services.filter(
            (service) => parseInt(service.user_id, 10) !== loggedInUserId
          );
          setStore({
            searchedProducts: filteredProducts,
            searchedServices: filteredServices,
          });
        } else {
          console.error("Failed to fetch items by name:", data);
        }
      } catch (error) {
        console.error("Error fetching items by name:", error);
      }
    },
  

      fetchUserItems: async function () {
        try {
          const token = localStorage.getItem("token");
          const headers = new Headers({
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          });
          const backendUrl = process.env.BACKEND_URL;
          const apiUrl = `${backendUrl}/api/user/items`;

          const response = await fetch(apiUrl, { headers: headers });
          const data = await response.json();

          if (response.ok) {
            setStore({
              userProducts: data.products,
              userServices: data.services,
            });
          } else {
            console.error("Failed to fetch user items:", data);
          }
        } catch (error) {
          console.error("Error fetching user items:", error);
        }
      },

      sendTradeProposal: async function (
        store,
        senderItem,
        receiverId,
        receiverItem,
        message,
        isSenderItemProduct = true,
        isReceiverItemProduct = true
      ) {
        try {
          const token = localStorage.getItem("token");
          const headers = new Headers({
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          });
          const backendUrl = process.env.BACKEND_URL;
          const apiUrl = `${backendUrl}/api/trades`;

          const requestBody = {
            receiver_id: receiverId,
            message: message,
          };

          if (isSenderItemProduct) {
            requestBody.sender_product_id = senderItem;
          } else {
            requestBody.sender_service_id = senderItem;
          }

          if (isReceiverItemProduct) {
            requestBody.receiver_product_id = receiverItem;
          } else {
            requestBody.receiver_service_id = receiverItem;
          }

          console.log("Request Body:", requestBody);

          const response = await fetch(apiUrl, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(requestBody),
          });

          const textResponse = await response.text();

          try {
            const data = JSON.parse(textResponse);
            if (response.ok) {
              console.log("Trade proposal sent successfully:", data);
              // Atualiza a store com a nova proposta de negociação
              setStore({
                tradeProposals: [...store.tradeProposals, data],
              });
            } else {
              console.log("Error sending trade proposal:", data);
            }
          } catch (error) {
            console.error("Error parsing JSON:", error);
            console.log("Server response:", textResponse);
          }
        } catch (error) {
          console.error("Error sending trade proposal:", error);
        }
      },

      getTrades: async () => {
        try {
          const token = localStorage.getItem("token");
          // Sair se o token for nulo
          if (!token) {
            return;
          }
          const headers = new Headers({
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          });
          const backendUrl = process.env.BACKEND_URL;
          const apiUrl = `${backendUrl}/api/trades`;

          const response = await fetch(apiUrl, {
            method: "GET",
            headers: headers,
          });

          const data = await response.json();

          if (response.ok) {
            setStore({
              sent_trades: data.sent_trades,
              received_trades: data.received_trades,
              new_sent_trades: data.new_sent_trades,
              new_received_trades: data.new_received_trades,
            });
          } else {
            console.log("Error fetching trades:", data);
          }
        } catch (error) {
          console.error("Error fetching trades:", error);
        }
      },

      clearTradeNotifications: () => {
        setStore({
          new_sent_trades: [],
          new_received_trades: [],
        });
      },

      addFavorite: async (item) => {
    try {
        const backendUrl = process.env.BACKEND_URL;
        const authToken = localStorage.getItem("token");

        if (!authToken) {
            throw new Error("Authentication Token not found");
        }

        const requestBody = item.service_id ? {service_id: item.id} : {product_id: item.id};

        const response = await fetch(`${backendUrl}/api/users/favorites`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify(requestBody),
        });

        const data = await response.json();

        if (response.ok) {
            console.log("Item successfully added to favorites!");
        } else {
            throw new Error(`Failed adding item to favorites: ${data.error}`);
        }
    } catch (error) {
        console.error("Error in the request:", error);
    }
},

    

      handleAcceptProposal: async function (proposalId) {
        try {
          const token = localStorage.getItem("token");
          const headers = new Headers({
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          });
          const backendUrl = process.env.BACKEND_URL;
          const apiUrl = `${backendUrl}/api/trades/${proposalId}`;
      
          // Primeiro atualizamos a proposta para "Aceita"
          const response = await fetch(apiUrl, {
            method: "PUT",
            headers: headers,
            body: JSON.stringify({
              status: "Accepted",
            }),
          });
          console.log(response.status);
          const data = await response.json();
          console.log(JSON.stringify(data, null, 2));
      
          // Atualiza a store com a proposta de negociação atualizada
          const store = getStore();
          const index = store.tradeProposals.findIndex(
            (proposal) => proposal.id === data.trade.id
          );
          if (index !== -1) {
            const updatedTradeProposals = [...store.tradeProposals];
            updatedTradeProposals[index] = data.trade;
            setStore({
              ...store,
              tradeProposals: updatedTradeProposals,
            });
          }
      
          // Prepara para abrir os detalhes do usuário
          actions.setTradePartnerData(data.sender.email, data.sender.first_name, data.sender.phone);
        } catch (error) {
          // Lógica de tratamento para erros
          console.error(error);
        }
      },
      

      handleDeclineProposal(proposalId) {
        try {
          const token = localStorage.getItem("token");
          const headers = new Headers({
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          });
          const backendUrl = process.env.BACKEND_URL;
          const apiUrl = `${backendUrl}/api/trades/${proposalId}`;

          fetch(apiUrl, {
            method: "PUT",
            headers: headers,
            body: JSON.stringify({
              status: "Declined",
            }),
          })
            .then((response) => response.json())
            .then((data) => {
              // Atualiza a store com a proposta de negociação atualizada
              const index = store.tradeProposals.findIndex(
                (proposal) => proposal.id === data.id
              );
              if (index !== -1) {
                store.tradeProposals[index] = data;
              }
            })
            .catch((error) => {
              // Lógica de tratamento para erros
            });
        } catch (error) {
          // Lógica de tratamento de erros
        }
      },
    },
  };
};

export default getState;
