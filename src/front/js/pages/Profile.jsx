import React, {useState} from 'react';
import Sidebar from './Sidebar.jsx';
import AddProduct from '../component/AddProducts.jsx';
import AddService from '../component/AddService.jsx';
import Search from '../component/Search.jsx';
import UserItems from '../component/UserItems.jsx';



const Profile = () => {
  // Estado para rastrear a opção de menu selecionada
  const [selectedMenu, setSelectedMenu] = useState(null);

  // Função para atualizar a opção de menu selecionada
  const handleMenuSelection = (menu) => {
    setSelectedMenu(menu);
  };

  return (
    <div className="profile-container">
      {/* Passa a função de callback para o componente Sidebar */}
     <Sidebar onMenuSelect={handleMenuSelection}/>
      <div className="content-area">
        {/* Renderiza o componente AddProduct se 'Add a product' estiver selecionado */}
        {selectedMenu === 'addProduct' && <AddProduct />}        
        {/* Aqui iremos adicionando condições adicionais para outras opções de menu */}
        {selectedMenu === 'addService' && <AddService />}
        {selectedMenu === 'search' && <Search />}
        {selectedMenu === 'userItems' && <UserItems />}
      </div>
    </div>
  );
};

export default Profile;
