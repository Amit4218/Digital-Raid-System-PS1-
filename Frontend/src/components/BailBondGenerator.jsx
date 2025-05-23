import React, { useRef, useState } from "react";
import html2pdf from "html2pdf.js";
import Navbar from "./Navbar";
import Loading from "../components/Loading";

const BailBondGenerator = () => {
  const bailBondRef = useRef(null);
  const [loading, setLoading] = useState(true);

 setTimeout(() => {
    setLoading(false);
  }, 300);

  const [formData, setFormData] = useState({
    suretyName: "",
    suretyAddress: "",
    defendantName: "",
    bailAmount: "",
    bailAmountWords: "",
    phoneNumber: "",
  });

  const [showPreview, setShowPreview] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePrint = () => {
    const element = bailBondRef.current;

    const opt = {
      margin: 10,
      filename: `BailBond_${Date.now()}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        backgroundColor: "#fff",
      },
      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "portrait",
      },
    };

    html2pdf().set(opt).from(element).save().catch(console.error);
  };
  if (loading) return <Loading />;
  return (
    <>
      <Navbar />
      <div className="min-h-screen p-6 bg-[#213448] text-black">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl text-white font-bold mt-30 mb-10">Bail Bond Generator</h1>
            <div className="space-x-3">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                {showPreview ? "Edit Form" : "Print View"}
              </button>
              {showPreview && (
                <button
                  onClick={handlePrint}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Download as PDF
                </button>
              )}
            </div>
          </div>

          {/* Form */}
          {!showPreview && (
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Surety Name"
                  name="suretyName"
                  value={formData.suretyName}
                  onChange={handleInputChange}
                />
                <Input
                  label="Surety Address"
                  name="suretyAddress"
                  value={formData.suretyAddress}
                  onChange={handleInputChange}
                />
                <Input
                  label="Defendant Name"
                  name="defendantName"
                  value={formData.defendantName}
                  onChange={handleInputChange}
                />
                <Input
                  label="Bail Amount (₹)"
                  name="bailAmount"
                  value={formData.bailAmount}
                  onChange={handleInputChange}
                />
                <Input
                  label="Bail Amount (in words)"
                  name="bailAmountWords"
                  value={formData.bailAmountWords}
                  onChange={handleInputChange}
                />
                <Input
                  label="Phone Number"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          )}

          {/* Print Preview */}
          {showPreview && (
            <div
              ref={bailBondRef}
              className="bg-white p-8 rounded-lg shadow-md"
              style={{
                fontFamily: "Arial, sans-serif",
                lineHeight: "1.6",
                color: "#000",
              }}
            >
              <h2
                style={{
                  textAlign: "center",
                  textDecoration: "underline",
                  fontWeight: "bold",
                  fontSize: "24px",
                  marginBottom: "20px",
                }}
              >
                BAIL BOND
              </h2>

              <p style={{ marginBottom: "20px" }}>
                I <span style={spanStyle}>{formData.suretyName || " "}</span> of
                <span style={spanStyle}>
                  {formData.suretyAddress || " "}
                </span>{" "}
                hereby declared myself (or we jointly and severally declare
                ourselves) surety for the said
                <span style={spanStyle}>
                  {formData.defendantName || " "}
                </span>{" "}
                that he/she shall attend at the court of/office of the
                compounding officer Excise on the day of the hearing fixed in
                the case him/her and in case of his making default therein, I
                bind myself (or we bind ourselves) to forfeit to the Government
                of Sikkim the sum of ₹
                <span style={spanStyle}>{formData.bailAmount || " "}</span>{" "}
                (Rupees{" "}
                <span style={spanStyle}>{formData.bailAmountWords || " "}</span>
                ) only/-.
              </p>

              <div style={{ marginTop: "40px" }}>
                <p>BAIL ACCEPTED</p>
                <p>(Signature of Surety)</p>
              </div>

              <p style={{ marginTop: "20px" }}>
                Phone No:{" "}
                <span style={spanStyle}>{formData.phoneNumber || " "}</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

// Input component
const Input = ({ label, name, value, onChange }) => (
  <div>
    <label className="block mb-1 font-medium">{label}:</label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      className="w-full p-2 border rounded"
    />
      </div>
      
      );

// Line style
const spanStyle = {
  borderBottom: "1px solid black",
  padding: "0 20px",
  display: "inline-block",
  minWidth: "150px",
};

export default BailBondGenerator;
