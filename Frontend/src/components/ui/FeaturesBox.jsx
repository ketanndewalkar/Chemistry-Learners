import React from 'react'
import { features } from '../../utils/constants';

const FeaturesBox = () => {
  return (
    <>
    <h1 className="mt-[5vw] text-signika text-gray-800 text-[clamp(1rem,2vw,1.25rem)] font-bold ">Features</h1>
    <div
  className="
    grid
    grid-cols-4
    gap-[clamp(1.5rem,2vw,2.5rem)]
    mt-[1vw]
    max-lg:grid-cols-2
    max-md:grid-cols-1
  "
>
    
  {features.map((item, index) => {
    const Icon = item.icon;

    return (
      <div
        key={index}
        className="
          flex
          flex-col
          gap-[clamp(0.6rem,0.8vw,0.9rem)]

          rounded-2xl
          border
          border-neutral-200
          bg-white

          p-[clamp(1.25rem,1.8vw,1.75rem)]

          transition-all
          duration-200
          hover:shadow-md
          hover:-translate-y-1

          max-sm:items-start
        "
      >
        {/* Icon */}
        <div
          className="
            flex
            items-center
            justify-center

            h-[clamp(2.25rem,2.6vw,2.75rem)]
            w-[clamp(2.25rem,2.6vw,2.75rem)]

            rounded-full
            border
            border-blue-100
            bg-blue-50
          "
        >
          <Icon className="text-blue-600 text-[clamp(1.1rem,1.4vw,1.25rem)]" />
        </div>

        {/* Title */}
        <h3
          className="
            font-semibold
            text-neutral-900
            text-[clamp(1rem,1.1vw,1.1rem)]
          "
        >
          {item.title}
        </h3>

        {/* Description */}
        <p
          className="
            text-neutral-600
            leading-relaxed
            text-[clamp(0.875rem,1vw,0.95rem)]

            max-sm:text-left
          "
        >
          {item.description}
        </p>
      </div>
    );
  })}
</div>
</>

  )
}

export default FeaturesBox