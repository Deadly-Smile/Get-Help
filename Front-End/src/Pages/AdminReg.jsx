import { useContext, useEffect, useState } from "react";
import { useApplyAdminMutation } from "../Store";
import LoadingContext from "../Context/LoadingContext";
import ToastMessage from "../Components/ToastMessage";

const AdminReg = () => {
  // const [validationErrors, setValidationErrors] = useState([]);
  const [formData, setFormData] = useState({
    mobile: "",
    nid_card_number: "",
    country: "",
    district: "",
    address: "",
    document: null,
  });
  const [applyAdmin, result] = useApplyAdminMutation();
  const isLoadingContext = useContext(LoadingContext);
  const [showToast, setShowToast] = useState(false);
  const handleShowToast = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000); // Hides the toast after 3 seconds
  };

  useEffect(() => {
    isLoadingContext.isLoading = result.isLoading;
  }, [result.isLoading]);
  useEffect(() => {
    if (result?.isError || result?.isSuccess) {
      handleShowToast();
    }
  }, [result?.isError, result?.isSuccess]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    // Handle document separately
    if (type === "file" && name === "document") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        document: files[0] || null, // Set to null if no file selected
      }));
    } else {
      setFormData((prevFormData) =>
        type === "checkbox"
          ? { ...prevFormData, [name]: checked }
          : { ...prevFormData, [name]: value }
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);

    const formDataToSend = new FormData();

    // Handle the document separately
    if (formData.document instanceof File) {
      formDataToSend.append("document", formData.document);
    }

    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }
    applyAdmin(formDataToSend);
  };

  let render = null;
  if (result.status === "rejected") {
    if (result?.error?.data?.errors) {
      let message;
      for (const key in result.error.data.errors) {
        // console.log(typeof result.error.data.errors[key][0]);
        // message.concat(" ", result.error.data.errors[key][0]);
        message = `${message}\n${result.error.data.errors[key][0]}`;
      }
      if (message.length > 0) {
        render = (
          <div>
            {showToast && <ToastMessage type={"error"} message={message} />}
          </div>
        );
      }
    }
  }

  if (result?.isSuccess) {
    render = (
      <div>
        {showToast && (
          <ToastMessage type={"success"} message={result?.data?.message} />
        )}
      </div>
    );
  }

  const additionalForm = (
    <section className="p-4">
      <div className="form-control mt-4">
        <label htmlFor="mobile" className={"label"}>
          <span className="label-text">Mobile</span>
        </label>
        <input
          type="text"
          id="mobile"
          name="mobile"
          value={formData.mobile}
          placeholder="Mobile Number"
          onChange={handleChange}
          className="input input-bordered"
          required
        />
      </div>
      <div className="form-control mt-4">
        <label htmlFor="nid_card_number" className={"label"}>
          <span className="label-text">NID Number</span>
        </label>
        <input
          type="text"
          id="nid_card_number"
          name="nid_card_number"
          value={formData.nid_card_number}
          placeholder="NID no."
          onChange={handleChange}
          className="input input-bordered"
          required
        />
      </div>
      <div className="form-control mt-4">
        <label htmlFor="country" className={"label"}>
          <span className="label-text">Country</span>
        </label>
        <input
          type="text"
          id="country"
          name="country"
          value={formData.country}
          placeholder="Your Country"
          onChange={handleChange}
          className="input input-bordered"
          required
        />
      </div>
      <div className="form-control mt-4">
        <label htmlFor="district" className={"label"}>
          <span className="label-text">District</span>
        </label>
        <input
          type="text"
          id="district"
          name="district"
          value={formData.district}
          placeholder="Your District"
          onChange={handleChange}
          className="input input-bordered"
          required
        />
      </div>
      <div className="form-control mt-4">
        <label htmlFor="address" className={"label"}>
          <span className="label-text">Address</span>
        </label>
        <input
          type="text"
          id="address"
          name="address"
          value={formData.address}
          placeholder="Include your house no. & Street name"
          onChange={handleChange}
          className="input input-bordered"
          required
        />
      </div>
      <div className="form-control mt-4">
        <label htmlFor="document" className={"label"}>
          <span className="label-text">Add a Document</span>
        </label>
        <input
          type="file"
          id="document"
          name="document"
          onChange={handleChange}
          className="file-input w-full max-w-xs"
        />
        {/* <input
          type="file"
          id="document"
          name="document"
          onChange={handleChange}
          className="input input-bordered"
          // required
        /> */}
      </div>
      <div className="flex justify-end mt-6">
        <button
          type="submit"
          onClick={handleSubmit}
          className="btn btn-warning"
        >
          Apply
        </button>
        {/* {dialog} */}
      </div>
    </section>
  );
  return (
    <>
      <div className="card shrink-0 w-full max-w-4xl shadow-sm neutral-content">
        <form className="card-body" encType="multipart/form-data">
          <h2 className="font-bold text-5xl mb-4 flex justify-center">
            Become an admin
          </h2>
          {additionalForm}
          {/* {Object.keys(validationErrors).length > 0 && (
            <div className="mb-4 text-red-600">
              {Object.keys(validationErrors).map((key) =>
                validationErrors[key].map((error, index) => (
                  <p key={index}>{error}</p>
                ))
              )}
            </div>
          )} */}
        </form>
      </div>
      {render}
      {/* <div>
        {result.isLoading && (
          <p className="flex justify-center text-blue-950">Loading...</p>
        )}
        {result.isSuccess && (
          <p className="flex justify-center text-blue-950">
            Edited successfully
          </p>
        )}
        {result.isError && (
          <p className="flex justify-center text-red-600">
            Something went wrong
          </p>
        )}
      </div> */}
    </>
  );
};

export default AdminReg;
