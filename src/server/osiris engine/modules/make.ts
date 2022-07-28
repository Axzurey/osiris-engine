import { Workspace } from "@rbxts/services";

const r = new Random()

export function makeDot(v: Vector3) {
    let p = new Instance("Part");
    p.Shape = Enum.PartType.Ball;
    p.Anchored = true;
    p.CanCollide = false;
    p.CanTouch = false;
    p.Material = Enum.Material.Neon;
    p.Color = new Color3(r.NextNumber(), r.NextNumber(), r.NextNumber())

    p.Size = new Vector3(.5, .5, .5);
    p.Position = v;

    p.Parent = Workspace;

    return p;
}