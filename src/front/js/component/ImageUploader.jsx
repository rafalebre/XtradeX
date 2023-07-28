// import React, { useState } from 'react';
// import { Image } from 'cloudinary-react';
// import { CloudinaryContext, Transformation, UploadWidget } from 'cloudinary-react';

// const ImageUploader = () => {
//     const [images, setImages] = useState([]);

//     const beginUpload = tag => {
//         const uploadOptions = {
//             cloudName: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME,
//             tags: [tag],
//             uploadPreset: process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET
//         };

//         window.cloudinary.openUploadWidget(uploadOptions, (error, photos) => {
//             if (!error) {
//                 console.log(photos);
//                 if(photos.event === 'success'){
//                     setImages([...images, photos.info.public_id]);
//                 }
//             } else {
//                 console.log(error);
//             }
//         })
//     };

//     return (
//         <div className="main">
//             <h1>Upload Images</h1>
//             <div className="upload">
//                 <button onClick={() => beginUpload()}>Upload Image</button> 
//             </div>
//             <section>
//                 <ul>
//                     {
//                         images.map((i, index) => 
//                             <li key={index}><Image publicId={i} cloudName={process.env.REACT_APP_CLOUDINARY_CLOUD_NAME} /></li>
//                         )
//                     }
//                 </ul>
//             </section>
//         </div>
//     );
// };

// export default ImageUploader;
