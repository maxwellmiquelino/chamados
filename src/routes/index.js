import { Routes, Route } from 'react-router-dom';
import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import Dashboard from '../pages/Dashboard';
import NewTicket from '../pages/NewTicket';
import Costumers from '../pages/Customers';
import NewCostumers from '../pages/NewCustomers';
import Profile from '../pages/Profile'
import Private from './Private';

export default function RoutesApp(){
    return (
        <Routes>
            <Route path='/' element={ <SignIn/> }/>
            <Route path='/register' element={ <SignUp/> }/>
            <Route path='/dashboard' element={ <Private><Dashboard/></Private>}/>
            <Route path='/newticket' element={ <Private><NewTicket/></Private>}/>
            <Route path='/newticket/:id' element={ <Private><NewTicket/></Private>}/>
            <Route path='/customers' element={ <Private><Costumers/></Private>}/>
            <Route path='/newcustomers' element={ <Private><NewCostumers/></Private>}/>
            <Route path='/newcustomers/:id' element={ <Private><NewCostumers/></Private>}/>
            <Route path='/profile' element={ <Private><Profile/></Private>}/>
        </Routes>
    )
}