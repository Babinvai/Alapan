import random

svg = []
svg.append("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1920 150'>")

# Colors for grass
colors = ['#2d4c1e', '#3a5f25', '#4b7c31', '#5a903c', '#6baa48']
flower_colors = [('#ffffff', '#ffcc00'), ('#ff9999', '#ff0000'), ('#99ccff', '#0000ff'), ('#ffff99', '#ff9900')]

# Generate 800 blades of grass
for _ in range(800):
    x = random.randint(-50, 1970)
    h = random.randint(30, 120)
    w = random.randint(3, 8)
    bend = random.randint(-30, 30)
    color = random.choice(colors)
    opacity = random.uniform(0.7, 1.0)
    # Path: start at bottom, curve up, curve back down
    path = f"M{x},150 Q{x+bend/2},{150-h/2} {x+bend},{150-h} Q{x+bend/2+w},{150-h/2} {x+w},150 Z"
    svg.append(f"<path d='{path}' fill='{color}' opacity='{opacity:.2f}'/>")

# Generate 30 flowers
for _ in range(30):
    x = random.randint(10, 1910)
    h = random.randint(40, 100)
    fy = 150 - h
    stem_color = random.choice(colors)
    f_color, c_color = random.choice(flower_colors)
    
    # Stem
    svg.append(f"<path d='M{x},150 Q{x-10},{150-h/2} {x},{fy}' stroke='{stem_color}' stroke-width='3' fill='none'/>")
    
    # Petals
    svg.append(f"<circle cx='{x-5}' cy='{fy-5}' r='6' fill='{f_color}'/>")
    svg.append(f"<circle cx='{x+5}' cy='{fy-5}' r='6' fill='{f_color}'/>")
    svg.append(f"<circle cx='{x-5}' cy='{fy+5}' r='6' fill='{f_color}'/>")
    svg.append(f"<circle cx='{x+5}' cy='{fy+5}' r='6' fill='{f_color}'/>")
    svg.append(f"<circle cx='{x}' cy='{fy-8}' r='6' fill='{f_color}'/>")
    svg.append(f"<circle cx='{x}' cy='{fy+8}' r='6' fill='{f_color}'/>")
    svg.append(f"<circle cx='{x-8}' cy='{fy}' r='6' fill='{f_color}'/>")
    svg.append(f"<circle cx='{x+8}' cy='{fy}' r='6' fill='{f_color}'/>")
    
    # Center
    svg.append(f"<circle cx='{x}' cy='{fy}' r='5' fill='{c_color}'/>")

svg.append("</svg>")

with open("grass.svg", "w") as f:
    f.write("".join(svg))
