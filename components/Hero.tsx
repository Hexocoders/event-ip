const Hero = () => {
  return (
    <div className="relative h-[500px] w-full">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/hero.png')",
        }}
      >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/70 via-purple-800/60 to-purple-700/50"></div>
      </div>
      
      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center text-white px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
          Pick up your wonderful plans
        </h1>
        <p className="text-xl md:text-2xl text-center mb-8">
          Discover amazing events happening around you
        </p>
      </div>
    </div>
  )
}

export default Hero