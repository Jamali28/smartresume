import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, X } from "lucide-react";
import type { ResumeForm as ResumeFormType } from "@shared/schema";

interface ResumeFormProps {
  form: UseFormReturn<ResumeFormType>;
  currentStep: number;
}

export default function ResumeForm({ form, currentStep }: ResumeFormProps) {
  const { register, watch, setValue, getValues } = form;

  const addExperience = () => {
    const currentExperience = getValues("experience");
    setValue("experience", [
      ...currentExperience,
      {
        position: "",
        company: "",
        startDate: "",
        endDate: "",
        current: false,
        description: "",
      },
    ]);
  };

  const removeExperience = (index: number) => {
    const currentExperience = getValues("experience");
    if (currentExperience.length > 1) {
      setValue("experience", currentExperience.filter((_, i) => i !== index));
    }
  };

  const addEducation = () => {
    const currentEducation = getValues("education");
    setValue("education", [
      ...currentEducation,
      {
        degree: "",
        school: "",
        graduationDate: "",
        gpa: "",
      },
    ]);
  };

  const removeEducation = (index: number) => {
    const currentEducation = getValues("education");
    if (currentEducation.length > 1) {
      setValue("education", currentEducation.filter((_, i) => i !== index));
    }
  };

  const addSkill = () => {
    const currentSkills = getValues("skills");
    setValue("skills", [...currentSkills, ""]);
  };

  const removeSkill = (index: number) => {
    const currentSkills = getValues("skills");
    if (currentSkills.length > 1) {
      setValue("skills", currentSkills.filter((_, i) => i !== index));
    }
  };

  const updateSkill = (index: number, value: string) => {
    const currentSkills = getValues("skills");
    const newSkills = [...currentSkills];
    newSkills[index] = value;
    setValue("skills", newSkills);
  };

  if (currentStep === 1) {
    return (
      <div className="space-y-6">
        <div>
          <Label htmlFor="title" className="text-base font-medium">
            Resume Title
          </Label>
          <Input
            id="title"
            {...register("title")}
            placeholder="e.g., Software Engineer - Google"
            className="mt-2"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName" className="text-base font-medium">
              First Name
            </Label>
            <Input
              id="firstName"
              {...register("personalInfo.firstName")}
              placeholder="John"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="lastName" className="text-base font-medium">
              Last Name
            </Label>
            <Input
              id="lastName"
              {...register("personalInfo.lastName")}
              placeholder="Doe"
              className="mt-2"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="professionalTitle" className="text-base font-medium">
            Professional Title
          </Label>
          <Input
            id="professionalTitle"
            {...register("personalInfo.title")}
            placeholder="Senior Software Engineer"
            className="mt-2"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="email" className="text-base font-medium">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              {...register("personalInfo.email")}
              placeholder="john.doe@example.com"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="phone" className="text-base font-medium">
              Phone
            </Label>
            <Input
              id="phone"
              {...register("personalInfo.phone")}
              placeholder="+1 (555) 123-4567"
              className="mt-2"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="location" className="text-base font-medium">
            Location
          </Label>
          <Input
            id="location"
            {...register("personalInfo.location")}
            placeholder="San Francisco, CA"
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="summary" className="text-base font-medium">
            Professional Summary
          </Label>
          <Textarea
            id="summary"
            {...register("personalInfo.summary")}
            rows={4}
            placeholder="Experienced software engineer with 5+ years developing scalable web applications..."
            className="mt-2"
          />
        </div>
      </div>
    );
  }

  if (currentStep === 2) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Work Experience</h3>
          <Button type="button" onClick={addExperience} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Experience
          </Button>
        </div>

        {watch("experience").map((_, index) => (
          <Card key={index} className="relative">
            <CardContent className="p-6">
              {watch("experience").length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeExperience(index)}
                  className="absolute top-4 right-4 text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}

              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Position</Label>
                    <Input
                      {...register(`experience.${index}.position`)}
                      placeholder="Software Engineer"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Company</Label>
                    <Input
                      {...register(`experience.${index}.company`)}
                      placeholder="Google"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Start Date</Label>
                    <Input
                      {...register(`experience.${index}.startDate`)}
                      placeholder="January 2020"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">End Date</Label>
                    <Input
                      {...register(`experience.${index}.endDate`)}
                      placeholder="Present"
                      disabled={watch(`experience.${index}.current`)}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`current-${index}`}
                    checked={watch(`experience.${index}.current`)}
                    onCheckedChange={(checked) =>
                      setValue(`experience.${index}.current`, !!checked)
                    }
                  />
                  <Label htmlFor={`current-${index}`} className="text-sm">
                    I currently work here
                  </Label>
                </div>

                <div>
                  <Label className="text-sm font-medium">Description</Label>
                  <Textarea
                    {...register(`experience.${index}.description`)}
                    rows={3}
                    placeholder="• Led development of scalable web applications serving millions of users
• Collaborated with cross-functional teams to deliver high-quality software solutions
• Implemented best practices for code quality and performance optimization"
                    className="mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (currentStep === 3) {
    return (
      <div className="space-y-8">
        {/* Education Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Education</h3>
            <Button type="button" onClick={addEducation} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Education
            </Button>
          </div>

          {watch("education").map((_, index) => (
            <Card key={index} className="relative">
              <CardContent className="p-6">
                {watch("education").length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeEducation(index)}
                    className="absolute top-4 right-4 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}

                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Degree</Label>
                      <Input
                        {...register(`education.${index}.degree`)}
                        placeholder="Bachelor of Science in Computer Science"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">School</Label>
                      <Input
                        {...register(`education.${index}.school`)}
                        placeholder="Stanford University"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Graduation Date</Label>
                      <Input
                        {...register(`education.${index}.graduationDate`)}
                        placeholder="May 2020"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">GPA (Optional)</Label>
                      <Input
                        {...register(`education.${index}.gpa`)}
                        placeholder="3.8"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Skills Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Skills</h3>
            <Button type="button" onClick={addSkill} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Skill
            </Button>
          </div>

          <div className="space-y-4">
            <div className="grid gap-3">
              {watch("skills").map((skill, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={skill}
                    onChange={(e) => updateSkill(index, e.target.value)}
                    placeholder="e.g., JavaScript, React, Node.js"
                    className="flex-1"
                  />
                  {watch("skills").length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSkill(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              {watch("skills")
                .filter((skill) => skill.trim())
                .map((skill, index) => (
                  <Badge key={index} variant="secondary">
                    {skill}
                  </Badge>
                ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
