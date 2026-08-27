import { useState } from "react";
import { Input, Select } from "../ui/Input";
import { Button } from "../ui/Button";

interface Props {
  onSubmit: (data: { passengerName: string; passengerAge: number; passengerGender: string }) => void;
  loading?: boolean;
  disabled?: boolean;
}

export function PassengerForm({ onSubmit, loading, disabled }: Props) {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("MALE");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Name is required";
    const nAge = parseInt(age, 10);
    if (!age) e.age = "Age is required";
    else if (isNaN(nAge) || nAge < 1 || nAge > 120) e.age = "Enter valid age (1-120)";
    if (!gender) e.gender = "Gender is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({ passengerName: name.trim(), passengerAge: parseInt(age, 10), passengerGender: gender });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input label="Passenger Name" id="pname" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" error={errors.name} />
      <Input label="Passenger Age" id="page" type="number" min={1} max={120} value={age} onChange={(e) => setAge(e.target.value)} placeholder="21" error={errors.age} />
      <Select label="Gender" id="pgender" value={gender} onChange={(e) => setGender(e.target.value)} error={errors.gender}>
        <option value="MALE">MALE</option>
        <option value="FEMALE">FEMALE</option>
        <option value="OTHER">OTHER</option>
      </Select>
      <Button type="submit" loading={loading} disabled={disabled} className="w-full">
        Confirm Booking
      </Button>
    </form>
  );
}
