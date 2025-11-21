import { Button } from "@/components/ui/button";
import { fetchSingleSession } from "@/slices/sessionSlice";
import { fetchSingleTeacher } from "@/slices/teacherSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";

export default function TeachersShow() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { singleTeachersData, singleTeachersError, singleTeachersLoading } =
        useSelector((state) => state.teacher);
    const { singleSessionsData, singleSessionsError, singleSessionsLoading } =
        useSelector((state) => state.session);

    useEffect(() => {
        dispatch(fetchSingleTeacher(id));
        dispatch(fetchSingleSession(id));
    }, [dispatch, id]);

    const ProfileCard = ({
        avatar,
        name,
        skills,
        bio,
        createdAt,
        isApproved,
        role,
    }) => (
        <div className="sticky top-24 space-y-6 p-6 rounded-lg border border-border bg-card h-fit  bg-gray-50">
            <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-foreground flex items-center justify-center text-background font-bold text-xl">
                    {avatar ? (
                        <img
                            src={avatar}
                            alt="Teacher Avatar"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        "T"
                    )}
                </div>
            </div>
            <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2">
                    <h1 className="text-2xl font-bold">{name}</h1>
                    {isApproved && (
                        <svg
                            className="w-5 h-5 text-foreground"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                        </svg>
                    )}
                </div>
                <p className="text-muted-foreground">{role}</p>
            </div>
            <div className="space-y-2 border-t border-border pt-4">
                <p className="text-sm text-muted-foreground leading-relaxed text-center">
                    {bio}
                </p>
            </div>
            <div className="space-y-3 border-t border-border pt-4 text-center">
                <h3 className="font-semibold text-sm">Skills & Expertise</h3>
                <div className="flex flex-wrap gap-2 justify-center">
                    {skills?.map((ele, i) => (
                        <span
                            key={i}
                            className="text-xs px-3 py-1 bg-foreground text-background rounded-full"
                        >
                            {ele}
                        </span>
                    ))}
                </div>
            </div>
            <div className="text-center space-y-1 border-t border-border pt-4">
                <p className="text-sm text-muted-foreground">Joined</p>
                <p className="font-semibold">{createdAt}</p>
            </div>
        </div>
    );

    const SessionCard = ({ title, amount, description, category, id }) => (
        <div className="p-6 rounded-lg border border-border hover:border-foreground transition space-y-4 group cursor-pointer mb-5">
            <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                    <h3 className="font-bold text-lg group-hover:text-foreground transition">
                        {title}
                    </h3>
                </div>
                <span className="text-xs px-3 py-1 bg-card border border-border rounded-full">
                    {category}
                </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                {description}
            </p>
            <div className="flex items-center justify-between pt-4 border-t border-border">
                <p className="font-bold text-lg">₹{amount}</p>
                <Link to={`/session/${id}`}>
                    <Button size="sm" variant="info">
                        View Details
                    </Button>
                </Link>
            </div>
        </div>
    );

    return (
        <div className="border-t border-border px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    {singleTeachersData ? (
                        <ProfileCard
                            avatar={singleTeachersData.avatar}
                            name={singleTeachersData.name}
                            skills={singleTeachersData.skills}
                            bio={singleTeachersData.bio}
                            createdAt={singleTeachersData.createdAt?.slice(
                                0,
                                10
                            )}
                            isApproved={singleTeachersData.isApproved}
                            role={singleTeachersData.role}
                        />
                    ) : (
                        <div className="text-center p-10 text-muted-foreground">
                            Loading...
                        </div>
                    )}
                </div>
                <div className="lg:col-span-2">
                    {singleSessionsData.length > 0 ? (
                        <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6">
                            {singleSessionsData.map((ele) => (
                                <SessionCard
                                    key={ele._id}
                                    title={ele?.title}
                                    description={ele?.description}
                                    amount={ele?.amount}
                                    category={ele?.category}
                                    id={ele._id}
                                />
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted-foreground">
                            No sessions listed
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
