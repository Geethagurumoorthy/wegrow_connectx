import React from "react";
import { IoMdDownload } from "react-icons/io";
import { Link } from "react-router-dom";

const Files = () => {
  return (
    <section className="bg-taupe-100 min-h-screen px-25 pt-10">
      <table className="w-full">
        <thead className="text-[12px]">
          <tr className="font-medium  bg-taupe-50 text-gray-500">
            <td className="p-2 w-90 whitespace-nowrap">
              Name
            </td>
            <td className="p-2 w-70 whitespace-nowrap">
              Shared by
            </td>
            <td className="p-2 w-25 whitespace-nowrap">
              Date
            </td>
            <td className="p-2 w-25 whitespace-nowrap">
              Size
            </td>
            <td className="p-2 w-20 whitespace-nowrap"></td>
          </tr>
        </thead>
        <tbody className="text-[13px]">
          <tr className="bg-white border border-taupe-200 hover:bg-taupe-200">
            <td className="p-3 whitespace-nowrap">
              <span
                className="mr-2 font-bold bg-taupe-700 
              text-[10px] text-white px-1 py-2 rounded-md"
              >
                TXT
              </span>
              Leave-policy-2026.txt
            </td>
            <td className="p-3 whitespace-nowrap">
              <span
                className="mr-2 font-bold bg-pink-600 
              text-[10px] text-white px-1 py-1 rounded-full"
              >
                PR
              </span>
              Priya Raghavan
            </td>
            <td className="p-3 whitespace-nowrap">4 Oct</td>
            <td className="p-3 whitespace-nowrap">234 B</td>
            <td className="p-2 whitespace-nowrap flex items-center">
              <a
                href="#"
                target="_blank"
                rel="noopener norefferer"
                download={"sample.txt"}
                className="p-1 hover:text-blue-800 hover:bg-blue-100"
              >
                <IoMdDownload size={24} />
              </a>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  );
};

export default Files;
