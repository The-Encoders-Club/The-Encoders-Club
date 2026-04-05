              {/* Mascot */}
              <motion.img
                src={PERSONAJE_URL}
                alt="Mascota"
                className="w-48 h-auto object-contain relative z-10 animate-float"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              />
              {/* Decorative ring - Moon rotation */}
              <div
                className="absolute w-80 h-80 rounded-full border border-[#FF2D78]/15 animate-rotate-slow"
                style={{ animationDuration: "25s" }}
              />
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-xs">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-white/30 to-transparent" />
        </motion.div>
      </section>

      {/* ── ABOUT ── */}