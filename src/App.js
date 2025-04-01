import { useState, useEffect } from "react";
import "./index.css";

// Function to get friends from local storage
const getFriendsFromLocalStorage = () => {
  const storedFriends = localStorage.getItem("friends");
  return storedFriends ? JSON.parse(storedFriends) : [];
};

// Function to save friends to local storage
const saveFriendsToLocalStorage = (friends) => {
  localStorage.setItem("friends", JSON.stringify(friends));
};

const initialFriends = [
  {
    id: 118836,
    name: "Folarin",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -70,
  },
  {
    id: 933372,
    name: "Abolore",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Akinwunmi",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

export default function App() {
  // Initialize friends state with local storage or fallback to initialFriends
  const [friends, setFriends] = useState(
    () => getFriendsFromLocalStorage() || initialFriends
  );
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);

  // Save friends to local storage whenever they change
  useEffect(() => {
    saveFriendsToLocalStorage(friends);
  }, [friends]);

  function handleShowAddFriend() {
    setShowAddFriend((show) => !show);
  }

  function handleAddFriend(friend) {
    setFriends((friends) => [friend, ...friends]);
  }

  function handleDeleteFriend(id) {
    setFriends((friends) => friends.filter((friend) => friend.id !== id));
  }

  function handleSelection(friend) {
    // setSelectedFriend(friend);
    setSelectedFriend((selectedFriend) =>
      selectedFriend && selectedFriend.id === friend.id ? null : friend
    );
    setShowAddFriend(false);
  }

  function handleSplitBill(value) {
    setFriends((friends) =>
      friends.map((friend) =>
        selectedFriend && selectedFriend.id === friend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setSelectedFriend(null);
  }

  return (
    <div className="appp">
      <NavBar />

      <div className="app">
        <div className="sidebar">
          <FriendsList
            friends={friends}
            selectedFriend={selectedFriend}
            handleSelection={handleSelection}
            handleDeleteFriend={handleDeleteFriend}
          />

          {showAddFriend && (
            <FormAddFriend
              handleShowAddFriend={handleShowAddFriend}
              onAddFriend={handleAddFriend}
            />
          )}

          <Button onClick={handleShowAddFriend}>
            {showAddFriend ? "Close" : "Add Friend"}
          </Button>
        </div>

        {selectedFriend && (
          <FormSplitBill
            selectedFriend={selectedFriend}
            handleSplitBill={handleSplitBill}
          />
        )}
      </div>
    </div>
  );
}

function NavBar() {
  return (
    <>
      <nav>
        <h1>
          EAT <span>n</span> SPLIT <span>A</span>PP
        </h1>
      </nav>
      <p className="nav-p">
        <span className="p-span"> Eating together just got simplier!</span>
        <br />
        No more awkward bill splitting! Add your friends and let the App do the
        math for you 😊
      </p>
    </>
  );
}

function FriendsList({
  friends,
  handleDeleteFriend,
  handleSelection,
  selectedFriend,
}) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          selectedFriend={selectedFriend}
          handleSelection={handleSelection}
          handleDeleteFriend={handleDeleteFriend}
        />
      ))}
    </ul>
  );
}

function Friend({
  friend,
  handleSelection,
  selectedFriend,
  handleDeleteFriend,
}) {
  const isSelected = selectedFriend && selectedFriend.id === friend.id;

  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>

      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} ${Math.abs(friend.balance)}
        </p>
      )}

      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes You ${Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance === 0 && (
        <p className="">You and {friend.name} are even.</p>
      )}
      <button className="btn" onClick={() => handleDeleteFriend(friend.id)}>
        Delete
      </button>
      <Button onClick={() => handleSelection(friend)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function FormAddFriend({ onAddFriend, handleShowAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function handleSubmit(e) {
    e.preventDefault();

    if (!name || !image) return;

    const id = crypto.randomUUID();

    const newFriend = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };

    onAddFriend(newFriend);

    setName("");
    setImage("https://i.pravatar.cc/48");
    handleShowAddFriend(false);
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>🕴️Friend name</label>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        type="text"
        placeholder="Friend's name"
        require
      />

      <label>🖼️Image URL</label>
      <input
        value={image}
        onChange={(e) => setImage(e.target.value)}
        type="text"
        placeholder="Enter Image Url"
      />

      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ selectedFriend, handleSplitBill }) {
  const [bill, setBill] = useState("");
  const [paidByUser, setPaidByUser] = useState("");
  const paidByFriend = bill ? bill - paidByUser : "";
  const [whoIsPaying, setWhoIsPaying] = useState("user");

  function handleSubmit(e) {
    e.preventDefault();

    if (!bill || !paidByUser) return;
    handleSplitBill(whoIsPaying === "user" ? paidByFriend : -paidByUser);
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with {selectedFriend.name}</h2>
      <label>💰 Bill value</label>
      <input
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
        type="text"
        placeholder="Enter value"
      />
      <label> 🕴️ Your expense</label>
      <input
        value={paidByUser}
        onChange={(e) =>
          setPaidByUser(
            Number(e.target.value) > bill ? paidByUser : Number(e.target.value)
          )
        }
        type="text"
        placeholder="Enter value"
      />

      <label> 🧑‍🤝‍🧑 {selectedFriend.name}'s expenses</label>
      <input value={paidByFriend} type="text" disabled />
      <label for="select">😉Who is paying the bill</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value={selectedFriend.name}>{selectedFriend.name}</option>
      </select>
      <Button>Split Bill</Button>
    </form>
  );
}
