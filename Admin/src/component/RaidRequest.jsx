import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import html2pdf from "html2pdf.js";
import policeLogo from "../Images/sikkimpolice-removebg-preview.png";

const RaidRequest = () => {
  const { raidId } = useParams();
  const navigate = useNavigate();
  const [raid, setRaid] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const fetchRaids = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/user/get-all-raids`,
          {
            headers: {
              "x-access-key": import.meta.env.VITE_SECRET_ACCESS_KEY,
            },
          }
        );

        const filtered = res.data.raids.find((raid) => raid._id === raidId);
        setRaid(filtered);
      } catch (error) {
        console.error("Error fetching unplanned raids:", error);
        toast.error("Failed to fetch unplanned raids");
      } finally {
        setLoading(false);
      }
    };

    fetchRaids();
  }, [raidId]);

  const generateWarrantPDF = async () => {
    if (!raid) return;

    // Create HTML content for the warrant
    const warrantHTML = `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 800px; margin: 0 auto; position: relative;">
        <!-- Watermark -->
        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); opacity: 0.1; z-index: -1;">
          <img src="${policeLogo}" style="width: 400px; height: auto;" />
        </div>
        
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #1a365d; font-size: 24px; margin-bottom: 5px;">Sikkim Police Department</h1>
          <h2 style="color: #3182ce; font-size: 20px; margin-bottom: 20px;">SEARCH WARRANT</h2>
          <div style="border-top: 2px solid #3182ce; width: 100px; margin: 0 auto;"></div>
        </div>
        
        <!-- Warrant Content -->
        <div style="margin-bottom: 20px;">
          <p style="text-align: right; margin-bottom: 30px;">Date: ${new Date().toLocaleDateString()}</p>
          
          <p style="margin-bottom: 15px; line-height: 1.6;">
            To: ${raid.inCharge || "Raid Officer"}<br/>
            Rank: Raid Officer
          </p>
          
          <p style="margin-bottom: 15px; line-height: 1.6;">
            You are hereby authorized and directed to conduct a search at the following premises:
          </p>
          
          <div style="background-color: #f0f4f8; padding: 15px; border-left: 4px solid #3182ce; margin-bottom: 20px;">
            <p><strong>Address:</strong> ${raid.location?.address || "N/A"}</p>
          </div>
          
          <p style="margin-bottom: 15px; line-height: 1.6;">
            <strong>Suspect Name:</strong> ${
              raid.culprits?.[0]?.name || "N/A"
            }<br/>
            <strong>Identification:</strong> ${
              raid.culprits?.[0]?.identification || "N/A"
            }
          </p>
          
          <p style="margin-bottom: 15px; line-height: 1.6;">
            <strong>Scheduled Raid Date:</strong> ${new Date(
              raid.scheduledDate
            ).toLocaleDateString()}
          </p>
          
          <p style="margin-bottom: 15px; line-height: 1.6;">
            <strong>Reason for Search:</strong> ${raid.description || "N/A"}
          </p>
          
          <p style="margin-bottom: 15px; line-height: 1.6;">
            This warrant is valid for execution on the specified date only. You are authorized to seize any items 
            that may be evidence of criminal activity.
          </p>
        </div>
        
        <!-- Footer -->
        <div style="margin-top: 50px;">
          <div style="float: right; text-align: center;">
            <div style="border-top: 1px solid #000; width: 200px; margin-bottom: 5px;"></div>
            <p>Authorized Signature</p>
            <p>Sikkim Police Department</p>
          </div>
          <div style="clear: both;"></div>
        </div>
      </div>
    `;

    // Generate PDF
    const options = {
      margin: 10,
      filename: `warrant_${
        raid.culprits?.[0]?.name?.replace(/\s+/g, "_") || "raid"
      }.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    try {
      // Generate the PDF
      const pdf = await html2pdf()
        .from(warrantHTML)
        .set(options)
        .outputPdf("blob");

      // Create a FormData object to send the PDF to the server
      const formDataToSend = new FormData();
      formDataToSend.append("warrant", pdf, `warrant_${Date.now()}.pdf`);

      // Upload the generated PDF
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/admin/upload-warrant`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "x-access-key": import.meta.env.VITE_SECRET_ACCESS_KEY,
          },
          timeout: 30000,
        }
      );

      return response.data.filePath;
    } catch (error) {
      console.error("Error generating or uploading warrant:", error);
      throw error;
    }
  };

  const handleApprove = async () => {
    try {
      setIsGenerating(true);
      const adminId = localStorage.getItem("adminId");
      if (!adminId) {
        toast.error("User ID not found in local storage");
        return;
      }

      // Generate and upload the warrant PDF
      const warrantFilePath = await generateWarrantPDF();

      const response = await axios.put(
        `${
          import.meta.env.VITE_BASE_URL
        }/admin/update-unplanned-request/${raidId}`,
        {
          approvedBy: adminId,
          approvalStatus: "approved",
          approvalDate: new Date(),
          warrant: {
            fileUrl: warrantFilePath,
          },
        },
        {
          headers: {
            "x-access-key": import.meta.env.VITE_SECRET_ACCESS_KEY,
          },
        }
      );

      toast.success("Raid approved and warrant generated successfully!");
      navigate("/admin/unplannedRaids");
    } catch (error) {
      console.error("Error approving raid:", error);
      toast.error("Failed to approve raid");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClose = () => {
    navigate("/admin/unplannedRaids");
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!raid) return <div className="p-6 text-red-600">Raid not found.</div>;

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="flex justify-between items-center mb-6 relative">
        <div className="text-red-500 font-semibold">UNEDITABLE</div>
        <button
          onClick={handleClose}
          className="w-8 h-8 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white text-lg font-bold rounded-full absolute right-0 top-0"
          aria-label="Close"
        >
          &times;
        </button>
      </div>

      <div className="bg-white border border-[#213448] shadow-2xl rounded-xl p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Info
            label="Culprit Name"
            value={raid.culprits?.[0]?.name || "N/A"}
          />
          <Info
            label="Identification"
            value={raid.culprits?.[0]?.identification || "N/A"}
          />
          <Info
            label="Crime Description"
            value={raid.culprits?.[0]?.description || "N/A"}
            wide
          />
          <Info label="Raid Officer (In-Charge)" value={raid.inCharge} />
          <Info
            label="Raid Date"
            value={new Date(raid.scheduledDate).toLocaleDateString()}
          />
          <Info label="Address" value={raid.location?.address || "N/A"} wide />
          <Info label="Raid Description" value={raid.description} wide />
        </div>

        <div className="flex flex-col md:flex-row md:justify-between items-center gap-6 mt-4">
          <button
            onClick={handleApprove}
            className="bg-green-600 text-white font-bold px-6 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
            disabled={isGenerating}
          >
            {isGenerating
              ? "Generating Warrant..."
              : "Approve & Generate Warrant"}
          </button>

          <button
            onClick={handleClose}
            className="bg-gray-300 text-[#213448] font-bold px-6 py-2 rounded-md hover:bg-gray-400"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const Info = ({ label, value, wide }) => (
  <div className={wide ? "md:col-span-2" : ""}>
    <label className="block text-sm font-medium text-[#213448]">{label}</label>
    <div className="mt-1 block w-full border border-[#213448] rounded-md shadow-sm p-3 bg-gray-100 text-[#213448]">
      {value}
    </div>
  </div>
);

export default RaidRequest;
