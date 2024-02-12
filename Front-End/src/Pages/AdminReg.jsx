import Button from "../Components/Button";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { useApplyAdminMutation } from "../Store";

const AdminReg = () => {
  const [validationErrors, setValidationErrors] = useState({});
  const [formData, setFormData] = useState({
    mobile: "",
    nid_card_number: "",
    country: "",
    district: "",
    address: "",
    document: null,
  });
  const [applyAdmin, result] = useApplyAdminMutation();

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

  useEffect(() => {
    if (result.status === "rejected") {
      if (result.error.data) {
        if (result.error.data.errors) {
          setValidationErrors({
            ...validationErrors,
            ...result.error.data.errors,
          });
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result]);

  const labelClassnames = classNames(
    "text-sm font-bold mr-2 w-1/4 flex items-center justify-start"
  );
  const inputClassnames = classNames(
    "w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
  );
  const additionalForm = (
    <section>
      <div className="flex mb-4">
        <label htmlFor="mobile" className={labelClassnames}>
          Mobile:
        </label>
        <input
          type="text"
          id="mobile"
          name="mobile"
          value={formData.mobile}
          placeholder="Mobile Number"
          onChange={handleChange}
          className={inputClassnames}
        />
      </div>
      <div className="flex mb-4">
        <label htmlFor="nid_card_number" className={labelClassnames}>
          NID Card Number:
        </label>
        <input
          type="text"
          id="nid_card_number"
          name="nid_card_number"
          value={formData.nid_card_number}
          placeholder="NID no."
          onChange={handleChange}
          className={inputClassnames}
        />
      </div>
      <div className="flex mb-4">
        <label htmlFor="country" className={labelClassnames}>
          Country:
        </label>
        <input
          type="text"
          id="country"
          name="country"
          value={formData.country}
          placeholder="Your Country"
          onChange={handleChange}
          className={inputClassnames}
        />
      </div>
      <div className="flex mb-4">
        <label htmlFor="district" className={labelClassnames}>
          District:
        </label>
        <input
          type="text"
          id="district"
          name="district"
          value={formData.district}
          placeholder="Your District"
          onChange={handleChange}
          className={inputClassnames}
        />
      </div>
      <div className="flex mb-4">
        <label htmlFor="address" className={labelClassnames}>
          Address:
        </label>
        <input
          type="text"
          id="address"
          name="address"
          value={formData.address}
          placeholder="Include your house no. & Street name"
          onChange={handleChange}
          className={inputClassnames}
        />
      </div>
      <div className="flex mb-4">
        <label htmlFor="document" className={labelClassnames}>
          Add a Document:
        </label>
        <input
          type="file"
          id="document"
          name="document"
          onChange={handleChange}
          className={inputClassnames}
        />
      </div>
      <div className="mt-4 flex justify-end">
        <Button
          type="submit"
          onClick={handleSubmit}
          secondary
          rounded
          className="text-white mr-2 px-4 py-2 rounded-md focus:outline-none focus:bg-white focus:text-gray-800 hover:text-gray-800 hover:bg-white"
        >
          Apply
        </Button>
      </div>
    </section>
  );
  return (
    <>
      <section>
        <form
          className="mx-auto my-4 p-6 max-w-4xl bg-white rounded shadow"
          encType="multipart/form-data"
        >
          <h2 className="font-bold text-5xl mb-4 flex justify-center">
            Apply to become an admin
          </h2>
          {additionalForm}
          {Object.keys(validationErrors).length > 0 && (
            <div className="mb-4 text-red-600">
              {Object.keys(validationErrors).map((key) =>
                validationErrors[key].map((error, index) => (
                  <p key={index}>{error}</p>
                ))
              )}
            </div>
          )}
        </form>
      </section>
      <div>
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
      </div>
    </>
  );
};

export default AdminReg;
