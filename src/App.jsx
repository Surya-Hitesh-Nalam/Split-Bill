import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];


export default function App(){
  const [addFriend,setAddFriend] = useState(false);
  const [friends,setFriends] = useState(initialFriends);
  const [selectedFriend,setSelectedFriend] = useState(null);

  function showAddFriend(){
    setAddFriend((show)=> !show);
  }

  function HandleAddFriend(friend){
    setFriends((friends)=>[...friends,friend]);
    setAddFriend(false);
  }

  function HnadleSelectFriend(friend){
    setSelectedFriend((selected)=> selected?.id === friend.id ? null : friend);
    setAddFriend(false);
  }

  return(
    <div className="app">
      <div className="sidebar">
        <FriendsList friends={friends} onSelection={HnadleSelectFriend} selectedFriend={selectedFriend}/>
        {addFriend && <FormAddFriend onAddFriend={HandleAddFriend}/>}
        <Button onClick={showAddFriend}>{addFriend ? "close" : "add friend"}</Button>
      </div>
      { selectedFriend && <FormSplitBill selectedFriend={selectedFriend}/>}
    </div>
  );
}

function FriendsList({friends , onSelection ,selectedFriend}){
  
  return(
    <ul>
      {friends.map((friend)=> (<Friend friend={friend} key={friend.id} onSelection={onSelection} selectedFriend={selectedFriend}/>))}
    </ul>
  );
}

function Friend({friend , onSelection ,selectedFriend}){
  const isSelected =selectedFriend?.id === friend.id;

  return(
    <li className={isSelected ? "selected":""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && <p className="red">you owe {friend.name} {Math.abs(friend.balance)}</p>}
      {friend.balance > 0 && <p className="green"> {friend.name} owe you {Math.abs(friend.balance)}</p>}
      {friend.balance === 0 && <p>you and {friend.name} even</p>}
      <Button onClick={()=>onSelection(friend)}>{isSelected ? "close":"select"}</Button>
    </li>
  );
}

function Button({children , onClick}){
  return(
    <button className="button" onClick={onClick}>{children}</button>
  );
}

function FormAddFriend({onAddFriend}){
  const [name,setname] = useState("");
  const [image,setimage] = useState("https://i.pravatar.cc/48");

  function handleSubmit(e){

    if(!name || !image) return;
    e.preventDefault();
    const id = crypto.randomUUID();
    const newFriend={ 
    id ,
    name ,
    image : `${image}?=${id}`,
    balance : 0,
    };
    onAddFriend(newFriend);
    setname("");
    setimage("https://i.pravatar.cc/48");
  }
  return(
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>👨🏼‍🤝‍👨🏼 add name</label>
      <input type="text" value={name} onChange={(e)=> setname(e.target.value)}/>
      <label>🖼 image url</label>
      <input type="text" value={image} onChange={(e)=>setimage(e.target.value)}/>
      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({selectedFriend}){
  const [bill,setBill] = useState("");
  const [paidByUser,setPainByUser] = useState("");
  const paidByFriend = bill? bill-paidByUser : "";
  const [whoIsPaying,setWhoIsPaying] = useState("user");
  return(
    <form className="form-split-bill" >
      <h2>Split Bill With {selectedFriend.name}</h2>

      <label>💰 Bill value</label>
      <input type="text" value={bill} onChange={(e)=>setBill(Number(e.target.value))}/>

      <label>🙉 Your Expences</label>
      <input type="text" value={paidByUser} onChange={(e)=>setPainByUser(Number(e.target.value) > bill ? paidByUser : Number(e.target.value) )}/>

      <label>👨🏼‍🤝‍👨🏼 {selectedFriend.name}'s expences</label>
      <input type="text" disabled value={paidByFriend}/>

      <label>🤑 who is paying bill</label>
      <select value={whoIsPaying} onChange={(e)=>setWhoIsPaying(e.target.value)}>
        <option value="user">you</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>
      <Button>split bill</Button>
    </form>
  );
}