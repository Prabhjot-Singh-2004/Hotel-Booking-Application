const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export default function PlacesImg({place,index=0,className}){
    if(!place.photos?.length){
        return '';
    }

    if(!className){
        className='object-cover w-full h-full';
    }

    return(
        <img className={className} src={API_URL + '/uploads/'+ place.photos[index]} alt="" />
    );
}