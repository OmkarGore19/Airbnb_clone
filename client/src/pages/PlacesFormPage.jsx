import Perks from "../Perks";
import axios from "axios";
import PhotosUploader from "../PhotosUploader";
import { useEffect ,useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import AccountNav from "../AccountNav";

export default function PlacesFormPage(params) {

  const {id} = useParams();

  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [addedPhotos, setAddedPhotos] = useState([]);
  const [description, setDescription] = useState("");
  const [perks, setPerks] = useState([]);
  const [extraInfo, setExtraInfo] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [maxGuests, setMaxGuests] = useState(1);
  const [price,setPrice] = useState('');
  const [redirect, setRedirect] = useState(false);
  
  useEffect(() => {
    if(!id){
      return;
    }
    axios.get('/places/'+id).then(response=>{
      const {data} = response;
      setTitle(data.title);
      setAddress(data.address);
      setAddedPhotos(data.photos);
      setDescription(data.description);
      setPerks(data.perks);
      setExtraInfo(data.extraInfo);
      setCheckIn(data.checkIn);
      setCheckOut(data.checkOut);
      setMaxGuests(data.maxGuests);
      setPrice(data.price);
    })
  }, [id])
  

  function inputHeader(text) {
    return <h2 className="text-2xl mt-4">{text}</h2>;
  }

  function inputDescription(text) {
    return <p className="text-gray-500 text-sm">{text}</p>;
  }

  function preInput(header, description) {
    return (
      <>
        {inputHeader(header)}
        {inputDescription(description)}
      </>
    );
  }

  async function savePlace(ev) {
    ev.preventDefault();
    const placeData={
      title,
        address,
        addedPhotos,
        description,
        perks,
        extraInfo,
        checkIn,
        checkOut,
        maxGuests,
        price,
    }
    if(id){
      //update
      await axios.put("/places", {
        id, ...placeData
        
      });
      setRedirect(true);
    }
    else{
      //newplace
      await axios.post("/places", placeData);
      setRedirect(true);
    }
    
  }

  if(redirect){
    return <Navigate to={'/account/places'}/>
  }

  return (
    <div>
      <AccountNav />
      <form onSubmit={savePlace}>
        {preInput(
          "Title",
          "Title for your place, should be short and catchy as in advertisement"
        )}
        <input
          type="text"
          value={title}
          onChange={(ev) => setTitle(ev.target.value)}
          placeholder="title,for example: My lovely apt"
        />

        {preInput("Address", "Address of your place")}
        <input
          type="text"
          value={address}
          onChange={(ev) => setAddress(ev.target.value)}
          placeholder="address"
        />

        {preInput("Photos", "more = better")}
        <PhotosUploader addedPhotos={addedPhotos} onChange={setAddedPhotos} />

        {preInput("Description", "Description of your place")}
        <textarea
          value={description}
          onChange={(ev) => setDescription(ev.target.value)}
        ></textarea>

        {preInput("Perks", "Select all the perks of your space..")}
        <Perks selected={perks} onChange={setPerks} />

        {preInput("Extra info", "House rules,etc..")}
        <textarea
          value={extraInfo}
          onChange={(ev) => setExtraInfo(ev.target.value)}
        ></textarea>
        {preInput(
          "Check in&out time",
          "Add check in and out times, remember to have some time window for cleaning the room between guests."
        )}

        <div className="gird gap-2 grid-cols-2 md:grid-cols-4">
          <div>
            <h3 className="mt-2">Check in time</h3>
            <input
              type="text"
              value={checkIn}
              onChange={(ev) => setCheckIn(ev.target.value)}
              placeholder="14"
            />
          </div>
          <div>
            <h3>Check out time</h3>
            <input
              type="text"
              value={checkOut}
              onChange={(ev) => setCheckOut(ev.target.value)}
              placeholder="22"
            />
          </div>
          <div>
            <h3 className="mt-2 -mb-1">Max number of guests</h3>
            <input
              type="number"
              value={maxGuests}
              onChange={(ev) => setMaxGuests(ev.target.value)}
              placeholder="for example: 2"
            />
          </div>
          <div>
            <h3 className="mt-2 -mb-1">Price per night</h3>
            <input
              type="number"
              value={price}
              onChange={(ev) => setPrice(ev.target.value)}
              placeholder=""
            />
          </div>
        </div>
        <button className="primary my-4">Save</button>
      </form>
    </div>
  );
}
