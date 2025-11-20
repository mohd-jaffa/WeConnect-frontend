import axios from "@/config/axios";
import UserContext from "@/context/UserContext";
import { useContext, useEffect, useState } from "react";
import { toast } from "sonner";

export default function Transactions() {
    const { user } = useContext(UserContext);
    const [paymentHistory, setPaymentHistory] = useState([]);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await axios.get(
                    `/payment/history/${user._id}`,
                    {
                        headers: {
                            Authorization: localStorage.getItem("token"),
                        },
                    }
                );
                const sortedData = response.data.sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                );
                setPaymentHistory(sortedData);
            } catch (err) {
                console.log(err);
                toast.error(err?.response?.data?.error);
            }
        };
        fetchHistory();
    }, [user?._id]);

    return (
        <div>
            <div className="my-6 w-full overflow-y-auto">
                <table className="w-full">
                    <thead>
                        <tr className="even:bg-muted m-0 border-t p-0">
                            <th className="border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right">
                                ID
                            </th>
                            <th className="border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right">
                                TIME
                            </th>
                            <th className="border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right">
                                AMOUNT
                            </th>
                            <th className="border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right">
                                STATUS
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {paymentHistory.map((ele) => {
                            return (
                                <tr
                                    key={ele._id}
                                    className="even:bg-muted m-0 border-t p-0"
                                >
                                    <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                                        {ele._id}
                                    </td>
                                    <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                                        {ele.createdAt.slice(0, 10)}
                                    </td>
                                    <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                                        {ele.amount}
                                    </td>
                                    <td
                                        className={`border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right ${
                                            ele.status === "success"
                                                ? "text-green-600"
                                                : "text-red-600"
                                        }`}
                                    >
                                        {ele.status}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
