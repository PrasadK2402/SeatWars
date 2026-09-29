import { useState } from "react";
import { Field, Input, Select } from "../ui/Form";
import { Button } from "../ui/Button";
import { Fingerprint } from "lucide-react";

export interface PassengerDetails {
  passengerName: string;
  passengerAge: number;
  passengerGender: string;
}

export function PassengerForm({
  onSubmit,
  loading,
}: {
  onSubmit: (data: PassengerDetails) => void;
  loading: boolean;
}) {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("Male");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "PASSENGER NAME IS REQUIRED.";
    const ageNum = Number(age);
    if (!age) errs.age = "AGE IS REQUIRED.";
    else if (!Number.isInteger(ageNum) || ageNum < 1 || ageNum > 120)
      errs.age = "ENTER A VALID AGE (1–120).";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    onSubmit({ passengerName: name.trim(), passengerAge: ageNum, passengerGender: gender });
  };

  return (
    <form onSubmit={submit} noValidate>
      <Field label="Passenger name" error={errors.name} htmlFor="pf-name">
        <Input
          id="pf-name"
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
          autoComplete="name"
        />
      </Field>
      <div className="grid grid-2">
        <Field label="Age" error={errors.age} htmlFor="pf-age">
          <Input
            id="pf-age"
            type="number"
            min={1}
            max={120}
            placeholder="e.g. 28"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            error={errors.age}
          />
        </Field>
        <Field label="Gender" htmlFor="pf-gender">
          <Select id="pf-gender" value={gender} onChange={(e) => setGender(e.target.value)}>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </Select>
        </Field>
      </div>
      <Button type="submit" block size="lg" loading={loading} className="mt-1">
        <Fingerprint /> Confirm booking
      </Button>
    </form>
  );
}
