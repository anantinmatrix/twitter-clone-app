import { useState } from 'react';
import './css/EditProfileImagesModal.css';

const EditProfileImagesModal = ({ show, closeFunction, editImageFunction, sendImage }) => {
    let [image, setimage] = useState(null);
    let [imagePreview, setimagePreview] = useState(null)

    function uploadImage(e) {
        let file = e.target.files[0];
        setimage(file)
        let url = URL.createObjectURL(file)
        setimagePreview(url)
        sendImage(file)
    }

    function handleClose() {
        closeFunction()
        setimage(null)
        setimagePreview(null)
        sendImage(null)
    }

    async function handleSubmit() {
        editImageFunction();

        closeFunction()
        setimage(null)
        setimagePreview(null)
        sendImage(null)

    }

    return (
        <>
            <div id="editImageModal" style={show ? { display: 'block' } : { display: 'none' }}>
                <div className="editImageBody">
                    <h5>Edit Profile Image</h5>
                    <hr />
                    <div className="editImageForm">
                        <form>
                            {imagePreview ?
                                <>
                                    <div className='formImagePreview'>
                                        <img src={imagePreview} alt="preview_image" />
                                    </div>
                                    <div>
                                        <label htmlFor="editImage">
                                            <div className="editImageLabel">
                                                <i className="fa-solid fa-plus"></i>
                                            </div>
                                        </label>
                                        <input type="file" accept='image/' onChange={(e) => { uploadImage(e) }} name="editImage" id="editImage" />
                                        <p className='text-center mt-2'>Change Image</p>
                                    </div>
                                </>
                                :
                                <>
                                    <label htmlFor="editImage">
                                        <div className="editImageLabel">
                                            <i className="fa-solid fa-plus"></i>
                                        </div>
                                    </label>
                                    <input type="file" accept='image/' onChange={(e) => { uploadImage(e) }} name="editImage" id="editImage" />
                                    <p className='text-center mt-2'>Upload Image</p>
                                </>
                            }
                            <div className="buttonGroup">
                                <button type='button' onClick={handleClose} className='btn btn-light'>Close</button>
                                <button type='button' onClick={handleSubmit} className="btn btn-primary">Done</button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default EditProfileImagesModal;