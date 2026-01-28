import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { applyForFellowship } from "./fellowshipApi";
import { FellowshipApplication } from "./fellowshipTypes";

interface FellowshipApplyProps {
    fellowshipId: string;
    improvedUi?: boolean;
}

type FormValues = {
    personalStatement: string;
    whyApplying: string;
    achievements?: string;
    futureGoals?: string;
    documents?: Array<{ name: string; url: string }>;
};

const FellowshipApply: React.FC<FellowshipApplyProps> = ({ fellowshipId, improvedUi }) => {
    const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const onSubmit = async (data: FormValues) => {
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            await applyForFellowship({
                fellowshipId,
                applicationData: {
                    personalStatement: data.personalStatement,
                    whyApplying: data.whyApplying,
                    achievements: data.achievements,
                    futureGoals: data.futureGoals,
                },
                documents: data.documents || [],
            });
            setSuccess("Application submitted successfully!");
        } catch (err: any) {
            setError(err?.response?.data?.message || "Failed to submit application");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={improvedUi ? "space-y-6" : undefined}>
            {error && <div className="text-error mb-2 text-sm text-center">{error}</div>}
            {success && <div className="text-success mb-2 text-sm text-center">{success}</div>}
            <div className={improvedUi ? "flex flex-col gap-2" : undefined}>
                <label className={improvedUi ? "font-medium text-sm mb-1" : undefined}>Personal Statement *</label>
                <textarea
                    {...register("personalStatement", { required: true, maxLength: 2000 })}
                    className={improvedUi ? "border rounded-lg p-2 w-full min-h-[60px] focus:outline-primary" : undefined}
                />
                {errors.personalStatement && <span className="text-error text-xs">Required (max 2000 chars)</span>}
            </div>
            <div className={improvedUi ? "flex flex-col gap-2" : undefined}>
                <label className={improvedUi ? "font-medium text-sm mb-1" : undefined}>Why Applying *</label>
                <textarea
                    {...register("whyApplying", { required: true, maxLength: 1000 })}
                    className={improvedUi ? "border rounded-lg p-2 w-full min-h-[60px] focus:outline-primary" : undefined}
                />
                {errors.whyApplying && <span className="text-error text-xs">Required (max 1000 chars)</span>}
            </div>
            <div className={improvedUi ? "flex flex-col gap-2" : undefined}>
                <label className={improvedUi ? "font-medium text-sm mb-1" : undefined}>Achievements</label>
                <textarea
                    {...register("achievements", { maxLength: 1000 })}
                    className={improvedUi ? "border rounded-lg p-2 w-full min-h-[40px] focus:outline-primary" : undefined}
                />
            </div>
            <div className={improvedUi ? "flex flex-col gap-2" : undefined}>
                <label className={improvedUi ? "font-medium text-sm mb-1" : undefined}>Future Goals</label>
                <textarea
                    {...register("futureGoals", { maxLength: 1000 })}
                    className={improvedUi ? "border rounded-lg p-2 w-full min-h-[40px] focus:outline-primary" : undefined}
                />
            </div>
            {/* Document upload UI can be added here */}
            <button
                type="submit"
                disabled={loading}
                className={improvedUi ? "w-full py-2 px-4 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors mt-4" : undefined}
            >
                {loading ? "Submitting..." : "Submit Application"}
            </button>
        </form>
    );
};

export default FellowshipApply;
